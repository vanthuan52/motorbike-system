import {
  BadRequestException,
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
import { IPartTypeMigrationUpsert } from '../interfaces/part-type.migration.interface';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPartTypeListFilters } from '../interfaces/part-type.filter.interface';
import { EnumPartTypeStatusCodeError } from '../enums/part-type.status-code.enum';
import { Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartTypeModel } from '../models/part-type.model';

@Injectable()
export class PartTypeService implements IPartTypeService {
  constructor(private readonly partTypeRepository: PartTypeRepository) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>> {
    const { data, ...others } =
      await this.partTypeRepository.findWithPaginationOffset(
        pagination,
        filters
      );

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationCursorReturn<PartTypeModel>> {
    const { data, ...others } =
      await this.partTypeRepository.findWithPaginationCursor(
        pagination,
        filters
      );

    return { data, ...others };
  }

  async findOneById(id: string): Promise<PartTypeModel> {
    const partType = await this.partTypeRepository.findOneById(id);
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
  ): Promise<PartTypeModel> {
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
      createdBy,
    };

    return this.partTypeRepository.create(data);
  }

  async update(
    id: string,
    payload: PartTypeUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PartTypeModel> {
    const partType = await this.partTypeRepository.findOneById(id);
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
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumPartTypeStatusCodeError.slugExisted,
          message: 'partType.error.slugExisted',
        });
      }
    }

    const slug = payload.slug ? payload.slug.toLowerCase() : partType.slug;

    const data: Prisma.PartTypeUpdateInput = {
      name: payload.name ?? undefined,
      slug,
      description: payload.description ?? undefined,
      updatedBy,
    };

    return this.partTypeRepository.update(id, data);
  }

  async updateStatus(
    id: string,
    { status }: PartTypeUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PartTypeModel> {
    await this.findOneById(id);
    return this.partTypeRepository.update(id, { status, updatedBy });
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PartTypeModel> {
    await this.findOneById(id);
    return this.partTypeRepository.softDelete(id, deletedBy);
  }

  // === Trash/Restore ===

  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>> {
    const { data, ...others } =
      await this.partTypeRepository.findWithPaginationOffsetTrashed(
        pagination,
        filters
      );
    return { data, ...others };
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<PartTypeModel> {
    const partType =
      await this.partTypeRepository.findOneByIdIncludeDeleted(id);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    if (!partType.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumPartTypeStatusCodeError.notInTrash,
        message: 'partType.error.notInTrash',
      });
    }

    return this.partTypeRepository.restore(id, restoredBy);
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PartTypeModel> {
    const partType =
      await this.partTypeRepository.findOneByIdIncludeDeleted(id);
    if (!partType) {
      throw new NotFoundException({
        statusCode: EnumPartTypeStatusCodeError.notFound,
        message: 'partType.error.notFound',
      });
    }

    if (!partType.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumPartTypeStatusCodeError.notInTrash,
        message: 'partType.error.notInTrash',
      });
    }

    return this.partTypeRepository.forceDelete(id);
  }

  // === Migration helpers ===

  /**
   * Upsert a part type by slug — skips if already exists.
   * Intended for use in migration seeds only; does not require requestLog or createdBy.
   */
  async upsertForMigration(payload: IPartTypeMigrationUpsert): Promise<void> {
    const existing = await this.partTypeRepository.findOneBySlug(payload.slug);
    if (existing) {
      return;
    }

    await this.partTypeRepository.create({
      name: payload.name,
      slug: payload.slug.toLowerCase(),
      description: payload.description,
      status: EnumPartTypeStatus.active,
    });
  }

  /**
   * Hard-delete all part type records.
   * Intended for use in migration seeds only.
   */
  async deleteMany(): Promise<void> {
    await this.partTypeRepository.deleteMany({});
  }
}
