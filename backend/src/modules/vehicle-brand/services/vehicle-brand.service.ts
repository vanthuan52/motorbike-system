import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { VehicleBrandRepository } from '../repository/vehicle-brand.repository';
import { IVehicleBrandService } from '../interfaces/vehicle-brand.service.interface';
import {
  VehicleBrandDoc,
  VehicleBrandEntity,
} from '../entities/vehicle-brand.entity';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { IVehicleBrandEntity } from '../interfaces/vehicle-brand.interface';

@Injectable()
export class VehicleBrandService implements IVehicleBrandService {
  constructor(
    private readonly vehicleBrandRepository: VehicleBrandRepository,
  ) {}

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const VehicleBrand = await this.vehicleBrandRepository.findOne(
      { name },
      options,
    );
    return !!VehicleBrand;
  }

  async existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const vehicleBrand = await this.vehicleBrandRepository.findOne(
      { slug },
      options,
    );
    return !!vehicleBrand;
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]> {
    return this.vehicleBrandRepository.findAll<VehicleBrandDoc>(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]> {
    return this.vehicleBrandRepository.findAll<VehicleBrandDoc>(find, options);
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc | null> {
    return this.vehicleBrandRepository.findOneById<VehicleBrandDoc>(
      _id,
      options,
    );
  }

  async join(repository: VehicleBrandDoc): Promise<VehicleBrandDoc> {
    return this.vehicleBrandRepository.join(
      repository,
      this.vehicleBrandRepository._join!,
    );
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc | null> {
    return this.vehicleBrandRepository.findOne<VehicleBrandDoc>(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.vehicleBrandRepository.getTotal(find, options);
  }

  async create(
    { name, slug, description, order, country }: VehicleBrandCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleBrandDoc> {
    const create: VehicleBrandEntity = new VehicleBrandEntity();
    create.name = name;
    create.slug = slug.toLowerCase();
    create.country = country;
    create.description = description;
    create.order = order;
    create.status = ENUM_VEHICLE_BRAND_STATUS.ACTIVE;

    return this.vehicleBrandRepository.create<VehicleBrandEntity>(
      create,
      options,
    );
  }

  async update(
    repository: VehicleBrandDoc,
    { name, slug, description, order, country }: VehicleBrandUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleBrandDoc> {
    repository.name = name ?? repository.name;
    repository.slug = slug ?? repository.slug;
    repository.description = description;
    repository.order = order;
    repository.country = country;

    return this.vehicleBrandRepository.save(repository, options);
  }

  async softDelete(
    repository: VehicleBrandDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleBrandDoc> {
    return this.vehicleBrandRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.vehicleBrandRepository.deleteMany(find, options);
    return true;
  }

  async updateStatus(
    repository: VehicleBrandDoc,
    { status }: VehicleBrandUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleBrandDoc> {
    repository.status = status;

    return this.vehicleBrandRepository.save(repository, options);
  }

  async findBySlug(slug: string): Promise<VehicleBrandDoc | null> {
    return this.vehicleBrandRepository.findOneBySlug(slug);
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  mapList(
    vehicleBrand: VehicleBrandDoc[] | IVehicleBrandEntity[],
  ): VehicleBrandListResponseDto[] {
    return plainToInstance(
      VehicleBrandListResponseDto,
      vehicleBrand.map((p: VehicleBrandDoc | IVehicleBrandEntity) =>
        typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    vehicleBrand: VehicleBrandDoc | IVehicleBrandEntity,
  ): VehicleBrandGetResponseDto {
    return plainToInstance(
      VehicleBrandGetResponseDto,
      typeof (vehicleBrand as any).toObject === 'function'
        ? (vehicleBrand as any).toObject()
        : vehicleBrand,
    );
  }
}
