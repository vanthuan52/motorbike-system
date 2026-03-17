import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PartTypeRepository } from '../repository/part-type.repository';
import { IPartTypeService } from '../interfaces/part-type.service.interface';
import { PartTypeDoc, PartTypeEntity } from '../entities/part-type.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_PART_TYPE_STATUS_CODE_ERROR } from '../enums/part-type.status-code.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@Injectable()
export class PartTypeService implements IPartTypeService {
  constructor(private readonly partTypeRepository: PartTypeRepository) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: PartTypeDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...status,
    };

    const [partTypes, total] = await Promise.all([
      this.partTypeRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.partTypeRepository.getTotal(find),
    ]);

    return {
      data: partTypes,
      total,
    };
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: PartTypeDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...status };

    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.partTypeRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.partTypeRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data;

    return { data: items, total: count };
  }

  async findOneById(
    partTypeId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartTypeDoc> {
    const partType = await this.partTypeRepository.findOneById(
      partTypeId,
      options,
    );
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async findOneBySlug(slug: string): Promise<PartTypeDoc> {
    const partType = await this.partTypeRepository.findOneBySlug(slug);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async create(
    payload: PartTypeCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    // Validate slug uniqueness
    if (payload.slug) {
      const existingBySlug = await this.partTypeRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'partType.error.slugExisted',
        });
      }
    }

    const create: PartTypeEntity = new PartTypeEntity();
    create.name = payload.name;
    create.slug = payload.slug
      ? payload.slug.toLowerCase()
      : slugify(payload.name, { lower: true, strict: true, locale: 'vi' });
    create.description = payload.description;
    create.status = EnumPartTypeStatus.active;
    create.photo = payload.photo;

    const created = await this.partTypeRepository.create(create, options);

    return { _id: created._id };
  }

  async update(
    partTypeId: string,
    payload: PartTypeUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== partType.slug) {
      const existingBySlug = await this.partTypeRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug && existingBySlug._id.toString() !== partTypeId) {
        throw new ConflictException({
          statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'partType.error.slugExisted',
        });
      }
    }

    partType.name = payload.name ?? partType.name;
    partType.slug = payload.slug ?? partType.slug;
    partType.description = payload.description;
    partType.photo = payload.photo;

    await this.partTypeRepository.save(partType, options);
  }

  async updateStatus(
    partTypeId: string,
    { status }: PartTypeUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }

    partType.status = status;
    await this.partTypeRepository.save(partType, options);
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<{ exist: boolean }> {
    const exist = await this.partTypeRepository.exists({ slug }, options);
    return {
      exist,
    };
  }

  async delete(
    partTypeId: string,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.delete({ _id: partTypeId }, options);
  }

  async softDelete(
    partTypeId: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: ENUM_PART_TYPE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.softDelete(partType, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.partTypeRepository.deleteMany(find, options);
    return true;
  }
}
