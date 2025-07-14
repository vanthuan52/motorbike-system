import {
  CareRecordItemDoc,
  CareRecordItemEntity,
} from '../entities/care-record-item.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { PartEntity } from '@/modules/part/entities/part.entity';

export interface ICareRecordItemEntity
  extends Omit<CareRecordItemEntity, 'careRecord' | 'part'> {
  careRecord: CareRecordEntity;
  part: PartEntity;
}

export interface ICareRecordItemDoc
  extends Omit<CareRecordItemDoc, 'careRecord' | 'part'> {
  careRecord: CareRecordEntity;
  part: PartEntity;
}
