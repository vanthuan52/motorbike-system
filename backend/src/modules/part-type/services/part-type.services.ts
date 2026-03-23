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
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPartTypeStatusCodeError } from '../enums/part-type.status-code.enum';
import { PartType, Prisma } from '@/generated/prisma-client';

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
  ): Promise<{ data: PartType[]; total: number }> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...where,
      ...status,
    };

    const [partTypes, total] = await Promise.all([
      this.partTypeRepository.findAll(
        {
          limit,
          skip,
          where: mergedWhere,
          orderBy,
        },
        status
      ),
      this.partTypeRepository.getTotal(
        {
          limit,
          skip,
          where: mergedWhere,
          orderBy,
        },
        status
      ),
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
    }: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<{ data: PartType[]; total?: number }> {
    const mergedWhere: Prisma.PartTypeWhereInput = {
      ...where,
      ...status,
    };

    const { data, count } =
      await this.partTypeRepository.findWithPaginationCursor({
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      });

    return { data, total: count };
  }

  async findOneById(partTypeId: string): Promise<PartType> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async findOneBySlug(slug: string): Promise<PartType> {
    const partType = await this.partTypeRepository.findOneBySlug(slug);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }
    return partType;
  }

  async create(payload: PartTypeCreateRequestDto): Promise<{ id: string }> {
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
    };

    const created = await this.partTypeRepository.create(data);

    return { id: created.id };
  }

  async update(
    partTypeId: string,
    payload: PartTypeUpdateRequestDto
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
    };

    await this.partTypeRepository.update(partTypeId, data);
  }

  async updateStatus(
    partTypeId: string,
    { status }: PartTypeUpdateStatusRequestDto
  ): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.update(partTypeId, { status });
  }

  async delete(partTypeId: string): Promise<void> {
    const partType = await this.partTypeRepository.findOneById(partTypeId);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    await this.partTypeRepository.delete(partTypeId);
  }
}
