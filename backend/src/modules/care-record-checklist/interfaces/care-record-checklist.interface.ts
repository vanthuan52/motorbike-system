import {
  CareRecordChecklistDoc,
  CareRecordChecklistEntity,
} from '../entities/care-record-checklist.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';

export interface ICareRecordChecklistEntity
  extends Omit<CareRecordChecklistEntity, 'careRecord' | 'serviceChecklist'> {
  careRecord: CareRecordEntity;
  serviceChecklist: ServiceChecklistEntity;
}

export interface ICareRecordChecklistDoc
  extends Omit<CareRecordChecklistDoc, 'careRecord' | 'serviceChecklist'> {
  careRecord: CareRecordEntity;
  serviceChecklist: ServiceChecklistEntity;
}
