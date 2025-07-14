import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from '../enums/care-record-checklist.enum';

import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';

export const CareRecordChecklistTableName = 'care_record_checklist';

@DatabaseEntity({
  collection: CareRecordChecklistTableName,
})
export class CareRecordChecklistEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordChecklistEntity.name,
  })
  careRecord: string;

  @DatabaseProp({
    required: true,
    ref: () => ServiceChecklistEntity.name,
  })
  serviceChecklist: string;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED,
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
  wearPercentage: number;

  @DatabaseProp({
    required: false,
  })
  imageBefore: string;

  @DatabaseProp({
    required: false,
  })
  imageAfter: string;
}

export const CareRecordChecklistSchema = DatabaseSchema(
  CareRecordChecklistEntity,
);

export type CareRecordChecklistDoc =
  IDatabaseDocument<CareRecordChecklistEntity>;
