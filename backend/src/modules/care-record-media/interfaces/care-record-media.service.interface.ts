import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { CareRecordMediaDoc } from '../entities/care-record-media.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export interface ICareRecordMediaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordMediaDoc[]; total: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordMediaDoc>;

  create(
    payload: CareRecordMediaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordMediaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
