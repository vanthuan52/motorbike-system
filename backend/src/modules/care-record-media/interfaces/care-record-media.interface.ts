import {
  CareRecordMediaDoc,
  CareRecordMediaEntity,
} from '../entities/care-record-media.entity';
import {
  CareRecordDoc,
  CareRecordEntity,
} from '@/modules/care-record/entities/care-record.entity';

export interface ICareRecordMediaEntity
  extends Omit<CareRecordMediaEntity, 'careRecord'> {
  CareRecord: CareRecordEntity;
}

export interface ICareRecordMediaDoc
  extends Omit<CareRecordMediaDoc, 'careRecord'> {
  CareRecord: CareRecordDoc;
}
