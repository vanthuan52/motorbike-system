import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { CareRecordConditionDoc } from '../entities/care-record-condition.entity';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordConditionGetResponseDto } from '../dtos/response/care-record-condition.get.response.dto';

export interface ICareRecordConditionService {
  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareRecordConditionDoc | null>;

  create(
    payload: CareRecordConditionCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordConditionDoc>;

  update(
    repository: CareRecordConditionDoc,
    payload: CareRecordConditionUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordConditionDoc>;

  softDelete(
    repository: CareRecordConditionDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareRecordConditionDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
  mapGet(data: CareRecordConditionDoc): CareRecordConditionGetResponseDto;
}
