import {
  EnumCareRecordServiceStatus,
  EnumCareRecordServiceType,
} from '../enums/care-record-service.enum';

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
  vehicleServiceId?: string;

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
