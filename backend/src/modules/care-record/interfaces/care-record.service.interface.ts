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
import { CareRecordDoc } from '../entities/care-record.entity';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import { AwsS3Dto } from '@/modules/aws/dtos/aws.s3.dto';
import { ICareRecordEntity } from './care-record.interface';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';

export interface ICareRecordService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordDoc[]>;

  findAllWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordEntity[]>;

  getTotalWithVehicleServiceAndVehicleModel(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc>;

  update(
    repository: CareRecordDoc,
    payload: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  softDelete(
    repository: CareRecordDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordDoc[]): CareRecordListResponseDto[];

  mapGet(data: CareRecordDoc): CareRecordGetResponseDto;

  mapGetPopulate(
    CareRecord: CareRecordDoc | ICareRecordEntity,
  ): CareRecordGetFullResponseDto;
}
