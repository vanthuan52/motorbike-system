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
import { CareRecordMediaDoc } from '../entities/care-record-media.entity';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaGetResponseDto } from '../dtos/response/care-record-media.get.response.dto';
import { ICareRecordMediaEntity } from './care-record-media.interface';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';

export interface ICareRecordMediaService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordMediaDoc[]>;

  findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordMediaEntity[]>;

  getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordMediaDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordMediaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordMediaDoc>;

  update(
    repository: CareRecordMediaDoc,
    payload: CareRecordMediaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordMediaDoc>;

  softDelete(
    repository: CareRecordMediaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordMediaDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordMediaDoc[]): CareRecordMediaListResponseDto[];

  mapGet(data: CareRecordMediaDoc): CareRecordMediaGetResponseDto;

  mapGetPopulate(
    CareRecordMedia: CareRecordMediaDoc | ICareRecordMediaEntity,
  ): CareRecordMediaGetFullResponseDto;
}
