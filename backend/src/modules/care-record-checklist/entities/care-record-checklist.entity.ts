import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import {
  ENUM_CARE_RECORD_CHECKLIST_RESULT,
  ENUM_CARE_RECORD_CHECKLIST_STATUS,
} from '../enums/care-record-checklist.enum';

import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';
import { CareRecordServiceEntity } from '@/modules/care-record-service/entities/care-record-service.entity';
import { PartEntity } from '@/modules/part/entities/part.entity';

export const CareRecordChecklistTableName = 'care_record_checklist';

@DatabaseEntity({
  collection: CareRecordChecklistTableName,
})
export class CareRecordChecklistEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordServiceEntity.name,
  })
  careRecordService: string;

  @DatabaseProp({
    required: false,
    ref: () => ServiceChecklistEntity.name,
  })
  serviceChecklist?: string;

  @DatabaseProp({
    required: false,
    maxlength: 500,
  })
  name?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_CHECKLIST_RESULT.UNCHECKED,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_CHECKLIST_RESULT,
  })
  result: ENUM_CARE_RECORD_CHECKLIST_RESULT;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_CHECKLIST_STATUS.PENDING,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_CHECKLIST_STATUS,
  })
  status: ENUM_CARE_RECORD_CHECKLIST_STATUS;

  @DatabaseProp({
    required: false,
    maxlength: 500,
  })
  note: string;

  @DatabaseProp({
    required: false,
    default: 100,
  })
  wearPercentage?: number;

  @DatabaseProp({
    required: false,
  })
  imageBefore: string;

  @DatabaseProp({
    required: false,
  })
  imageAfter: string;

  @DatabaseProp({
    required: false,
    ref: () => PartEntity.name,
    type: [String],
    default: [],
  })
  parts: string[]; // Danh sách phụ tùng đề xuất thay thế
}

export const CareRecordChecklistSchema = DatabaseSchema(
  CareRecordChecklistEntity,
);

export type CareRecordChecklistDoc =
  IDatabaseDocument<CareRecordChecklistEntity>;
