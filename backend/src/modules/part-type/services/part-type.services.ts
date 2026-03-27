import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { PartTypeRepository } from '../repository/part-type.repository';
import { IPartTypeService } from '../interfaces/part-type.service.interface';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPartTypeStatusCodeError } from '../enums/part-type.status-code.enum';
import { Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartTypeModel } from '../models/part-type.model';

@Injectable()
export class PartTypeService implements IPartTypeService {
  constructor(private readonly partTypeRepository: PartTypeRepository) {}

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<PartTypeModel>> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...where,
      ...status,
    };

    const { data, ...others } =
      await this.partTypeRepository.findWithPaginationOffset({
        limit,
        skip,
        where: mergedWhere,
        orderBy,
      });

    return {
      data,
      ...others,
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
    }: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<PartTypeModel>> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...where,
      ...status,
    };

    const { data, ...others } =
      await this.partTypeRepository.findWithPaginationCursor({
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      });

    return { data, ...others };
  }

  async findOneById(partTypeId: string): Promise<PartTypeModel> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async findOneBySlug(slug: string): Promise<PartTypeModel> {
    const partType = await this.partTypeRepository.findOneBySlug(slug);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async create(
    payload: PartTypeCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }> {
    // Validate slug uniqueness
    if (payload.slug) {
      const existingBySlug = await this.partTypeRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: EnumPartTypeStatusCodeError.slugExisted,
          message: 'partType.error.slugExisted',
        });
      }
    }

    const slug = payload.slug
      ? payload.slug.toLowerCase()
      : slugify(payload.name, { lower: true, strict: true, locale: 'vi' });

    const data: Prisma.PartTypeCreateInput = {
      name: payload.name,
      slug,
      description: payload.description,
      status: EnumPartTypeStatus.active,
      photo: payload.photo ?? null,
      createdBy: createdBy,
    };

    const created = await this.partTypeRepository.create(data);

    return { id: created.id };
  }

  async update(
    partTypeId: string,
    payload: PartTypeUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== partType.slug) {
      const existingBySlug = await this.partTypeRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug && existingBySlug.id !== partTypeId) {
        throw new ConflictException({
          statusCode: EnumPartTypeStatusCodeError.slugExisted,
          message: 'partType.error.slugExisted',
        });
      }
    }

    const slug = payload.slug ? payload.slug.toLowerCase() : partType.slug;

    const data: Prisma.PartTypeUpdateInput = {
      name: payload.name ?? undefined,
      slug: slug,
      description: payload.description ?? undefined,
      photo: payload.photo ?? undefined,
      updatedBy: updatedBy,
    };

    await this.partTypeRepository.update(partTypeId, data);
  }

  async updateStatus(
    partTypeId: string,
    payload: PartTypeUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const { status } = payload;
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.update(partTypeId, {
      status,
      updatedBy: updatedBy,
    });
  }

  async delete(
    partTypeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.update(partTypeId, {
      deletedAt: new Date(),
      deletedBy: deletedBy,
    });
  }
}
