import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VehicleBrandRepository } from '../repository/vehicle-brand.repository';
import { IVehicleBrandService } from '../interfaces/vehicle-brand.service.interface';
import { VehicleBrand, Prisma } from '@/generated/prisma-client';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumVehicleBrandStatusCodeError } from '../enums/vehicle-brand.status-code.enum';

@Injectable()
export class VehicleBrandService implements IVehicleBrandService {
  constructor(
    private readonly vehicleBrandRepository: VehicleBrandRepository,
    private readonly vehicleBrandUtil: VehicleBrandUtil,
  ) {}

  async existByName(name: string): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ name });
    return !!vehicleBrand;
  }

  async existBySlug(slug: string): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ slug });
    return !!vehicleBrand;
  }

  async findAll(find?: Prisma.VehicleBrandWhereInput): Promise<VehicleBrand[]> {
    return this.vehicleBrandRepository.findAll({ where: find } as any);
  }

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleBrand[]; total: number }> {
    const { data, count } =
      await this.vehicleBrandRepository.findWithPaginationOffset(
        pagination,
        filters,
      );

    return {
      data,
      total: count,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    filters?: Record<string, IPaginationIn>,
  ): Promise<{ data: VehicleBrand[]; total?: number }> {
    const { data, count } =
      await this.vehicleBrandRepository.findWithPaginationCursor(
        pagination,
        filters,
      );

    return { data, total: count };
  }

  async findOneById(id: string): Promise<VehicleBrand> {
    const vehicleBrand = await this.findOneByIdOrFail(id);
    return vehicleBrand;
  }

  async findOne(find: Prisma.VehicleBrandWhereInput): Promise<VehicleBrand> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne(find);
    if (!vehicleBrand) {
      return null as any;
    }
    return vehicleBrand;
  }

  async getTotal(find?: Prisma.VehicleBrandWhereInput): Promise<number> {
    return this.vehicleBrandRepository.getTotal({ where: find } as any);
  }

  async create(payload: VehicleBrandCreateRequestDto): Promise<VehicleBrand> {
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
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    if (payload.slug && payload.slug !== repository.slug) {
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

    await this.vehicleBrandRepository.update(id, {
      name: payload.name ?? undefined,
      slug: payload.slug ? payload.slug.toLowerCase() : undefined,
      description: payload.description ?? undefined,
      orderBy: payload.orderBy ?? undefined,
      country: payload.country ?? undefined,
    });
  }

  async updateStatus(
    id: string,
    { status }: VehicleBrandUpdateStatusRequestDto,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);

    await this.vehicleBrandRepository.update(id, { status });
  }

  async delete(id: string): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.vehicleBrandRepository.delete(id);
  }

  async deleteMany(find?: Prisma.VehicleBrandWhereInput): Promise<boolean> {
    await this.vehicleBrandRepository.deleteMany(find || {});
    return true;
  }

  async findBySlug(slug: string): Promise<VehicleBrand> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne({ slug });
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: EnumVehicleBrandStatusCodeError.notFound,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }

  private async findOneByIdOrFail(id: string): Promise<VehicleBrand> {
    const vehicleBrand = await this.vehicleBrandRepository.findOneById(id);
    if (!vehicleBrand) {
      throw new NotFoundException({
        statusCode: EnumVehicleBrandStatusCodeError.notFound,
        message: 'vehicle-brand.error.notFound',
      });
    }
    return vehicleBrand;
  }
}
