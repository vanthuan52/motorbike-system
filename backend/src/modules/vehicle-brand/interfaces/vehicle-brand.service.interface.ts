import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { VehicleBrandDoc } from '../entities/vehicle-brand.entity';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';

export interface IVehicleBrandService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<VehicleBrandDoc[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrandDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: VehicleBrandDoc[]; total?: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<VehicleBrandDoc>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: VehicleBrandCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<VehicleBrandDoc>;

  update(
    id: string,
    payload: VehicleBrandUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: VehicleBrandUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  findBySlug(slug: string): Promise<VehicleBrandDoc>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;
}
