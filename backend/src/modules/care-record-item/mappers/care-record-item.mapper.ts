import { CareRecordItemModel } from '../models/care-record-item.model';
import { EnumCareRecordItemSource, EnumCareRecordItemType } from '../enums/care-record-item.enum';

export class CareRecordItemMapper {
  static toDomain(prismaItem: any): CareRecordItemModel {
    const model = new CareRecordItemModel();
    model.id = prismaItem.id;
    model.source = prismaItem.source?.toLowerCase() as EnumCareRecordItemSource;
    model.itemType = prismaItem.itemType?.toLowerCase() as EnumCareRecordItemType;
    model.name = prismaItem.name;
    model.quantity = prismaItem.quantity;
    model.unitPrice = prismaItem.unitPrice;
    model.totalPrice = prismaItem.totalPrice;
    model.approvedByOwner = prismaItem.approvedByOwner;
    model.note = prismaItem.note;
    model.careRecordId = prismaItem.careRecordId;
    model.vehicleServiceId = prismaItem.vehicleServiceId;
    model.partId = prismaItem.partId;
    model.technicianId = prismaItem.technicianId;

    model.createdAt = prismaItem.createdAt;
    model.updatedAt = prismaItem.updatedAt;
    model.deletedAt = prismaItem.deletedAt;
    model.createdBy = prismaItem.createdBy;
    model.updatedBy = prismaItem.updatedBy;
    model.deletedBy = prismaItem.deletedBy;

    return model;
  }
}
