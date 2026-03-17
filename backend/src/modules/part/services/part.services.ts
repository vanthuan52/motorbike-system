import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { IPartService } from '../interfaces/part.service.interface';
import { PartRepository } from '../respository/part.repository';
import { PartDoc, PartEntity } from '../entities/part.entity';
import { IPartDoc } from '../interfaces/part.interface';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_PART_STATUS_CODE_ERROR } from '../enums/part.status-code.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { PartTypeService } from '@/modules/part-type/services/part-type.services';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';

@Injectable()
export class PartService implements IPartService {
  constructor(
    private readonly partRepository: PartRepository,
    private readonly partTypeService: PartTypeService,
    private readonly vehicleBrandService: VehicleBrandService,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: PartDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...status,
    };

    if (partTypeId) {
      find.partType = partTypeId;
    }
    if (vehicleBrandId) {
      find.vehicleBrand = vehicleBrandId;
    }

    const [parts, total] = await Promise.all([
      this.partRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        join: true,
      }),
      this.partRepository.getTotal(find, { join: true }),
    ]);

    return {
      data: parts,
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
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: PartDoc[]; total?: number }> {
    const find: Record<string, any> = { ...where, ...status };

    if (partTypeId) {
      find.partType = partTypeId;
    }
    if (vehicleBrandId) {
      find.vehicleBrand = vehicleBrandId;
    }
    if (cursor && cursorField) {
      find[cursorField] = { $gt: cursor };
    }

    const [data, count] = await Promise.all([
      this.partRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
        join: true,
      }),
      includeCount
        ? this.partRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    const items = data;

    return { data: items, total: count };
  }

  async findOneById(
    partId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc> {
    const part = await this.partRepository.findOneById(partId, options);
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async findOneWithRelationsById(
    partId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc> {
    const part = await this.partRepository.findOneById<IPartDoc>(partId, {
      ...options,
      join: true,
    });
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async findOneBySlug(
    slug: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc> {
    const part = await this.partRepository.findOneBySlug(slug, {
      ...options,
      join: true,
    });
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async create(
    payload: PartCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    // Validate slug uniqueness
    if (payload.slug) {
      const existingBySlug = await this.partRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: ENUM_PART_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'part.error.slugExisted',
        });
      }
    }

    // Validate partType exists
    await this.partTypeService.findOneById(payload.partType);

    // Validate vehicleBrand exists
    await this.vehicleBrandService.findOneById(payload.vehicleBrand);

    const create: PartEntity = new PartEntity();
    create.name = payload.name;
    create.slug = payload.slug
      ? payload.slug.toLowerCase()
      : slugify(payload.name, { lower: true, strict: true, locale: 'vi' });
    create.vehicleBrand = payload.vehicleBrand;
    create.partType = payload.partType;
    create.order = payload.order;
    create.description = payload.description;
    create.status = payload.status ?? ENUM_PART_STATUS.ACTIVE;

    const created = await this.partRepository.create(create, options);

    return { _id: created._id };
  }

  async update(
    partId: string,
    payload: PartUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== part.slug) {
      const existingBySlug = await this.partRepository.findOneBySlug(
        payload.slug,
      );
      if (existingBySlug && existingBySlug._id.toString() !== partId) {
        throw new ConflictException({
          statusCode: ENUM_PART_STATUS_CODE_ERROR.SLUG_EXISTED,
          message: 'part.error.slugExisted',
        });
      }
    }

    // Validate partType if changing
    if (payload.partType && payload.partType !== part.partType) {
      await this.partTypeService.findOneById(payload.partType);
    }

    // Validate vehicleBrand if changing
    if (payload.vehicleBrand && payload.vehicleBrand !== part.vehicleBrand) {
      await this.vehicleBrandService.findOneById(payload.vehicleBrand);
    }

    part.name = payload.name ?? part.name;
    part.slug = payload.slug ?? part.slug;
    part.order = payload.order ?? part.order;
    part.vehicleBrand = payload.vehicleBrand ?? part.vehicleBrand;
    part.partType = payload.partType ?? part.partType;
    part.description = payload.description;

    await this.partRepository.save(part, options);
  }

  async updateStatus(
    partId: string,
    { status }: PartUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    part.status = status;
    await this.partRepository.save(part, options);
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<{ exist: boolean }> {
    const exist = await this.partRepository.exists({ slug }, options);
    return {
      exist,
    };
  }

  async delete(
    partId: string,
    options?: IDatabaseUpdateOptions,
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    await this.partRepository.delete({ _id: partId }, options);
  }

  async softDelete(
    partId: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: ENUM_PART_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'part.error.notFound',
      });
    }

    await this.partRepository.softDelete(part, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.partRepository.deleteMany(find, options);
    return true;
  }
}
