import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VehicleBrandRepository } from '../repository/vehicle-brand.repository';
import { IVehicleBrandService } from '../interfaces/vehicle-brand.service.interface';
import { Prisma } from '@/generated/prisma-client';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumVehicleBrandStatusCodeError } from '../enums/vehicle-brand.status-code.enum';
import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

@Injectable()
export class VehicleBrandService implements IVehicleBrandService {
  constructor(
    private readonly vehicleBrandRepository: VehicleBrandRepository,
    private readonly vehicleBrandUtil: VehicleBrandUtil
  ) {}

  async existByName(name: string): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ name });
    return !!vehicleBrand;
  }

  async existBySlug(slug: string): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ slug });
    return !!vehicleBrand;
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<VehicleBrandModel>> {
    return this.vehicleBrandRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<VehicleBrandModel>> {
    return this.vehicleBrandRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<VehicleBrandModel> {
    const vehicleBrand = await this.vehicleBrandRepository.findOneById(id);
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: EnumVehicleBrandStatusCodeError.notFound,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }

  async findOne(
    find: Prisma.VehicleBrandWhereInput
  ): Promise<VehicleBrandModel | null> {
    return this.vehicleBrandRepository.findOne(find);
  }

  async create(
    payload: VehicleBrandCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<VehicleBrandModel> {
    // Check slug conflict
    const existingSlug = await this.vehicleBrandRepository.findOne({
      slug: payload.slug,
    });
    if (existingSlug) {
      throw new ConflictException({
        statusCode: EnumVehicleBrandStatusCodeError.slugExisted,
        message: 'vehicle-brand.error.slugExisted',
      });
    }

    const created = await this.vehicleBrandRepository.create({
      name: payload.name,
      slug: payload.slug.toLowerCase(),
      country: payload.country ?? null,
      description: payload.description ?? null,
      orderBy: payload.orderBy,
      status: EnumVehicleBrandStatus.active,
    });

    return created;
  }

  async update(
    id: string,
    payload: VehicleBrandUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleBrandModel> {
    const vehicleBrand = await this.findOneById(id);

    if (payload.slug && payload.slug !== vehicleBrand.slug) {
      const existingSlug = await this.vehicleBrandRepository.findOne({
        slug: payload.slug,
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictException({
          statusCode: EnumVehicleBrandStatusCodeError.slugExisted,
          message: 'vehicle-brand.error.slugExisted',
        });
      }
    }

    const updated = await this.vehicleBrandRepository.update(id, {
      name: payload.name ?? undefined,
      slug: payload.slug ? payload.slug.toLowerCase() : undefined,
      description: payload.description ?? undefined,
      orderBy: payload.orderBy ?? undefined,
      country: payload.country ?? undefined,
    });

    return updated;
  }

  async updateStatus(
    id: string,
    payload: VehicleBrandUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<VehicleBrandModel> {
    await this.findOneById(id);
    const updated = await this.vehicleBrandRepository.update(id, {
      status: payload.status,
    });
    return updated;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<VehicleBrandModel> {
    await this.findOneById(id);
    const deleted = await this.vehicleBrandRepository.update(id, {
      deletedAt: new Date(),
    });
    return deleted;
  }

  async findBySlug(slug: string): Promise<VehicleBrandModel> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ slug });
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: EnumVehicleBrandStatusCodeError.notFound,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }
}
