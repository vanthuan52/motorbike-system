import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { VehicleBrandDoc } from '../entities/vehicle-brand.entity';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandGetResponseDto } from '../dtos/response/vehicle-brand.get.response.dto';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';

export interface IVehicleBrandService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<VehicleBrandDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleBrandCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleBrandDoc>;

  update(
    repository: VehicleBrandDoc,
    payload: VehicleBrandUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleBrandDoc>;

  softDelete(
    repository: VehicleBrandDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<VehicleBrandDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  mapList(data: VehicleBrandDoc[]): VehicleBrandListResponseDto[];
  mapGet(data: VehicleBrandDoc): VehicleBrandGetResponseDto;
}
