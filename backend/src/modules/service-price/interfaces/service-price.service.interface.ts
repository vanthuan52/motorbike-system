import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { ServicePriceDoc } from '../entities/service-price.entity';
import {
  IModelServicePrice,
  IServicePriceDoc,
  IServicePriceEntity,
} from './service-price.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export interface IServicePriceService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServicePriceDoc[]>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServicePriceDoc[]; total: number }>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  findAllWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IServicePriceEntity[]>;

  getTotalWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc>;

  join(repository: ServicePriceDoc): Promise<IServicePriceDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc>;

  create(
    payload: ServicePriceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: ServicePriceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseDeleteOptions): Promise<void>;

  softDelete(
    repository: ServicePriceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServicePriceDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  getLatestServicePrices(): Promise<IModelServicePrice[]>;

  getLatestPricesForService(
    find: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IModelServicePrice[]>;

  getTotalLatestPricesForService(
    find: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;
}
