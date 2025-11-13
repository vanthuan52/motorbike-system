import {
  IDatabaseAggregateOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareRecordServiceDoc } from '../entities/care-record-service.entity';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceGetResponseDto } from '../dtos/response/care-record-service.get.response.dto';
import { ICareRecordServiceEntity } from './care-record-service.interface';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';

export interface ICareRecordServiceService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordServiceDoc[]>;

  findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordServiceEntity[]>;

  getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordServiceDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordServiceDoc>;

  update(
    repository: CareRecordServiceDoc,
    payload: CareRecordServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc>;

  updateStatus(
    repository: CareRecordServiceDoc,
    { status }: CareRecordServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc>;

  softDelete(
    repository: CareRecordServiceDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordServiceDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordServiceDoc[]): CareRecordServiceListResponseDto[];

  mapGet(data: CareRecordServiceDoc): CareRecordServiceGetResponseDto;

  mapGetPopulate(
    careRecordService: CareRecordServiceDoc | ICareRecordServiceEntity,
  ): CareRecordServiceGetFullResponseDto;
}
