import { CareRecordItemModel } from '../models/care-record-item.model';
import {
  EnumCareRecordItemSource,
  EnumCareRecordItemType,
} from '../enums/care-record-item.enum';
import { CareRecordMapper } from '@/modules/care-record/mappers/care-record.mapper';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';
import { PartMapper } from '@/modules/part/mappers/part.mapper';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { CareRecordItem as PrismaCareRecordItem } from '@/generated/prisma-client';

export class CareRecordItemMapper {
  static toDomain(prismaItem: PrismaCareRecordItem): CareRecordItemModel {
    const model = new CareRecordItemModel();
    model.id = prismaItem.id;
    model.source = prismaItem.source as EnumCareRecordItemSource;
    model.itemType = prismaItem.itemType as EnumCareRecordItemType;
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

    if (prismaItem.careRecord) {
      model.careRecord = CareRecordMapper.toDomain(prismaItem.careRecord);
    }
    if (prismaItem.vehicleService) {
      model.vehicleService = VehicleServiceMapper.toDomain(
        prismaItem.vehicleService
      );
    }
    if (prismaItem.part) {
      model.part = PartMapper.toDomain(prismaItem.part);
    }
    if (prismaItem.technician) {
      model.technician = UserMapper.toDomain(prismaItem.technician);
    }

    return model;
  }
}
