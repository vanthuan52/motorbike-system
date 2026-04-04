import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { IPartService } from '../interfaces/part.service.interface';
import { PartRepository } from '../respository/part.repository';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { EnumPartStatus } from '../enums/part.enum';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPartListFilters } from '../interfaces/part.filter.interface';
import { EnumPartStatusCodeError } from '../enums/part.status-code.enum';
import { PartTypeService } from '@/modules/part-type/services/part-type.services';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartModel } from '../models/part.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class PartService implements IPartService {
  constructor(
    private readonly partRepository: PartRepository,
    private readonly partTypeService: PartTypeService,
    private readonly vehicleBrandService: VehicleBrandService
  ) {}

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<Prisma.PartSelect, Prisma.PartWhereInput>,
    filters?: IPartListFilters
  ): Promise<IPaginationOffsetReturn<PartModel>> {
    const mergedWhere: Prisma.PartWhereInput = {
      ...where,
      ...filters,
    };

    const { data, ...others } =
      await this.partRepository.findWithPaginationOffset({
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
    }: IPaginationQueryCursorParams<Prisma.PartSelect, Prisma.PartWhereInput>,
    filters?: IPartListFilters
  ): Promise<IPaginationCursorReturn<PartModel>> {
    const mergedWhere: Prisma.PartWhereInput = {
      ...where,
      ...filters,
    };

    const { data, ...others } =
      await this.partRepository.findWithPaginationCursor({
        limit,
        where: mergedWhere,
        orderBy,
        cursor,
        cursorField,
        includeCount,
      });

    return { data, ...others };
  }

  async findOneById(partId: string): Promise<PartModel> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async findOneWithRelationsById(partId: string): Promise<PartModel> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async findOneBySlug(slug: string): Promise<PartModel> {
    const part = await this.partRepository.findOneBySlug(slug);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }
    return part;
  }

  async create(
    payload: PartCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }> {
    // Validate slug uniqueness
    if (payload.slug) {
      const existingBySlug = await this.partRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug) {
        throw new ConflictException({
          statusCode: EnumPartStatusCodeError.slugExisted,
          message: 'part.error.slugExisted',
        });
      }
    }

    // Validate partType exists
    await this.partTypeService.findOneById(payload.partType);

    // Validate vehicleBrand exists
    await this.vehicleBrandService.findOneById(payload.vehicleBrand);

    const slug = payload.slug
      ? payload.slug.toLowerCase()
      : slugify(payload.name, { lower: true, strict: true, locale: 'vi' });

    const data: Prisma.PartCreateInput = {
      name: payload.name,
      slug,
      vehicleBrand: { connect: { id: payload.vehicleBrand } },
      partType: { connect: { id: payload.partType } },
      orderBy: payload.orderBy ?? 0,
      description: payload.description ?? null,
      status: payload.status ?? EnumPartStatus.active,
      createdBy: createdBy,
    };

    const created = await this.partRepository.create(data);

    return { id: created.id };
  }

  async update(
    partId: string,
    payload: PartUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }

    // Validate slug uniqueness if changing
    if (payload.slug && payload.slug !== part.slug) {
      const existingBySlug = await this.partRepository.findOneBySlug(
        payload.slug
      );
      if (existingBySlug && existingBySlug.id !== partId) {
        throw new ConflictException({
          statusCode: EnumPartStatusCodeError.slugExisted,
          message: 'part.error.slugExisted',
        });
      }
    }

    // Validate partType if changing
    if (payload.partType && payload.partType !== part.partTypeId) {
      await this.partTypeService.findOneById(payload.partType);
    }

    // Validate vehicleBrand if changing
    if (payload.vehicleBrand && payload.vehicleBrand !== part.vehicleBrandId) {
      await this.vehicleBrandService.findOneById(payload.vehicleBrand);
    }

    const slug = payload.slug ? payload.slug.toLowerCase() : part.slug;

    const data: Prisma.PartUpdateInput = {
      name: payload.name ?? undefined,
      slug: slug,
      orderBy: payload.orderBy ?? undefined,
      vehicleBrand: payload.vehicleBrand
        ? { connect: { id: payload.vehicleBrand } }
        : undefined,
      partType: payload.partType
        ? { connect: { id: payload.partType } }
        : undefined,
      description: payload.description ?? undefined,
      updatedBy: updatedBy,
    };

    await this.partRepository.update(partId, data);
  }

  async updateStatus(
    partId: string,
    payload: PartUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const { status } = payload;
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }

    await this.partRepository.update(partId, {
      status,
      updatedBy: updatedBy,
    });
  }

  async delete(
    partId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const part = await this.partRepository.findOneById(partId);
    if (!part) {
      throw new NotFoundException({
        statusCode: EnumPartStatusCodeError.notFound,
        message: 'part.error.notFound',
      });
    }

    await this.partRepository.update(partId, {
      deletedAt: new Date(),
      deletedBy: deletedBy,
    });
  }
}
