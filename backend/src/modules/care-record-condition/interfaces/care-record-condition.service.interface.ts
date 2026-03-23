import { CareRecordCondition } from '@prisma/client';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export interface ICareRecordConditionService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordCondition[]; total: number }>;

  findOneById(id: string): Promise<CareRecordCondition>;

  create(payload: CareRecordConditionCreateRequestDto): Promise<DatabaseIdDto>;

  update(
    id: string,
    payload: CareRecordConditionUpdateRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
