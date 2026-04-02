import {
  EnumCareRecordItemSource,
  EnumCareRecordItemType,
} from '../enums/care-record-item.enum';
import { CareRecordModel } from '@/modules/care-record/models/care-record.model';
import { VehicleServiceModel } from '@/modules/vehicle-service/models/vehicle-service.model';
import { PartModel } from '@/modules/part/models/part.model';
import { UserModel } from '@/modules/user/models/user.model';

/**
 * Domain model representing an item (part/service) within a care record.
 * Maps from Prisma CareRecordItem to application domain layer.
 */
export class CareRecordItemModel {
  id: string;
  source: EnumCareRecordItemSource;
  itemType: EnumCareRecordItemType;
  name?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  approvedByOwner?: boolean;
  note?: string;

  careRecordId: string;
  careRecord?: CareRecordModel;
  vehicleServiceId: string;
  vehicleService?: VehicleServiceModel;
  partId?: string;
  part?: PartModel;
  technicianId?: string;
  technician?: UserModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareRecordItemModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
