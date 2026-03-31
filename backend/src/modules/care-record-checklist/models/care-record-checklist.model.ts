import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';

/**
 * Domain model representing a care record checklist entry.
 * Maps from Prisma CareRecordChecklist to application domain layer.
 */
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

  constructor(data?: Partial<CareRecordChecklistModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
