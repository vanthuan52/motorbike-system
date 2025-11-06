import {
  CareRecordConditionDoc,
  CareRecordConditionEntity,
} from '../entities/care-record-condition.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';

export interface ICareRecordConditionEntity
  extends Omit<CareRecordConditionEntity, 'careRecord'> {
  careRecord: CareRecordEntity;
}

export interface ICareRecordConditionDoc
  extends Omit<CareRecordConditionDoc, 'careRecord'> {
  careRecord: CareRecordEntity;
}
