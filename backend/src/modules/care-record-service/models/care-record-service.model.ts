import { EnumCareRecordServiceStatus, EnumCareRecordServiceType } from '../enums/care-record-service.enum';

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
}
