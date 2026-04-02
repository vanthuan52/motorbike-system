import {
  EnumCareRecordServiceStatus,
  EnumCareRecordServiceType,
} from '../enums/care-record-service.enum';
import { CareRecordModel } from '@/modules/care-record/models/care-record.model';
import { VehicleServiceModel } from '@/modules/vehicle-service/models/vehicle-service.model';
import { CareRecordChecklistModel } from '@/modules/care-record-checklist/models/care-record-checklist.model';

/**
 * Domain model representing a service within a care record.
 * Maps from Prisma CareRecordService to application domain layer.
 */
export class CareRecordServiceModel {
  id: string;
  name: string;
  status: EnumCareRecordServiceStatus;
  type: EnumCareRecordServiceType;

  careRecordId: string;
  careRecord?: CareRecordModel;
  vehicleServiceId?: string;
  vehicleService?: VehicleServiceModel;

  // Child relations
  careRecordChecklists?: CareRecordChecklistModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareRecordServiceModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
