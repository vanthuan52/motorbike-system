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
import { CareRecordItemDoc } from '../entities/care-record-item.entity';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemGetResponseDto } from '../dtos/response/care-record-item.get.response.dto';
import { ICareRecordItemEntity } from './care-record-item.interface';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';

export interface ICareRecordItemService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareRecordItemDoc[]>;

  findAllWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<ICareRecordItemEntity[]>;

  getTotalWithPopulate(
    find?: Record<string, any>,
    options?: IDatabaseAggregateOptions,
  ): Promise<number>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordItemDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordItemDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareRecordItemCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordItemDoc>;

  update(
    repository: CareRecordItemDoc,
    payload: CareRecordItemUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc>;

  updateApproval(
    repository: CareRecordItemDoc,
    { approvedByOwner }: CareRecordItemUpdateApprovalRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc>;

  softDelete(
    repository: CareRecordItemDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordItemDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  mapList(data: CareRecordItemDoc[]): CareRecordItemListResponseDto[];

  mapGet(data: CareRecordItemDoc): CareRecordItemGetResponseDto;

  mapGetPopulate(
    CareRecordItem: CareRecordItemDoc | ICareRecordItemEntity,
  ): CareRecordItemGetFullResponseDto;
}
