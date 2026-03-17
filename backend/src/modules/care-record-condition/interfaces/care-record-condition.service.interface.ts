import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordConditionDoc } from '../entities/care-record-condition.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export interface ICareRecordConditionService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordConditionDoc[]; total: number }>;
  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordConditionDoc>;

  create(
    payload: CareRecordConditionCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordConditionUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
