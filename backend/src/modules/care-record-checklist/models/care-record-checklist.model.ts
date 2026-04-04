import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';
import { CareRecordServiceModel } from '@/modules/care-record-service/models/care-record-service.model';
import { ServiceChecklistModel } from '@/modules/service-checklist/models/service-checklist.model';

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
  imageBeforeCdnUrl?: string;
  imageAfterCdnUrl?: string;

  careRecordServiceId: string;
  careRecordService?: CareRecordServiceModel;
  serviceChecklistId?: string;
  serviceChecklist?: ServiceChecklistModel;

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
