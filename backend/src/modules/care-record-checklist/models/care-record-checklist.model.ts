import { EnumCareRecordChecklistResult, EnumCareRecordChecklistStatus } from '../enums/care-record-checklist.enum';

export class CareRecordChecklistModel {
  id: string;
  name?: string;
  result: EnumCareRecordChecklistResult;
  status: EnumCareRecordChecklistStatus;
  note?: string;
  wearPercentage?: number;
  imageBefore?: string;
  imageAfter?: string;
  careRecordServiceId: string;
  serviceChecklistId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
