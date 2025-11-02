import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const CareRecordConditionTableName = 'care_record_conditions';

@DatabaseEntity({
  collection: CareRecordConditionTableName,
})
export class CareRecordConditionEntity extends DatabaseEntityBase {}

export const CareRecordConditionSchema = DatabaseSchema(
  CareRecordConditionEntity,
);

export type CareRecordConditionDoc =
  IDatabaseDocument<CareRecordConditionEntity>;
