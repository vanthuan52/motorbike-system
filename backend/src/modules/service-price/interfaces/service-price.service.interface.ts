import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServicePriceDoc } from '../entities/service-price.entity';
import { ServicePriceCreateRequestDto } from '../dtos/request/service-price.create.request.dto';
import { ServicePriceUpdateRequestDto } from '../dtos/request/service-price.update.request.dto';
import { ServicePriceListResponseDto } from '../dtos/response/service-price.list.response.dto';
import { ServicePriceGetResponseDto } from '../dtos/response/service-price.get.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { IServicePriceEntity } from './service-price.interface';
import { ServicePriceGetFullResponseDto } from '../dtos/response/service-price.full.response.dto';

export interface IServicePriceService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServicePriceDoc[]>;

  findAllWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<IServicePriceEntity[]>;

  getTotalWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<ServicePriceDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServicePriceDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: ServicePriceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServicePriceDoc>;

  update(
    repository: ServicePriceDoc,
    payload: ServicePriceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServicePriceDoc>;

  softDelete(
    repository: ServicePriceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServicePriceDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: ServicePriceDoc[]): ServicePriceListResponseDto[];

  mapGet(data: ServicePriceDoc): ServicePriceGetResponseDto;

  mapGetPopulate(
    ServicePrice: ServicePriceDoc | IServicePriceEntity,
  ): ServicePriceGetFullResponseDto;
}
