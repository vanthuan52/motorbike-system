import { EnumCareRecordItemSource, EnumCareRecordItemType } from '../enums/care-record-item.enum';

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
  vehicleServiceId: string;
  partId?: string;
  technicianId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
