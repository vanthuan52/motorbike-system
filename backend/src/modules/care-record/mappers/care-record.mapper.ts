import { CareRecordModel } from '../models/care-record.model';
import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';
import { AppointmentMapper } from '@/modules/appointment/mappers/appointment.mapper';
import { UserVehicleMapper } from '@/modules/user-vehicle/mappers/user-vehicle.mapper';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { StoreMapper } from '@/modules/store/mappers/store.mapper';
import { CareRecordItemMapper } from '@/modules/care-record-item/mappers/care-record-item.mapper';
import { CareRecordServiceMapper } from '@/modules/care-record-service/mappers/care-record-service.mapper';
import { CareRecordMediaMapper } from '@/modules/care-record-media/mappers/care-record-media.mapper';
import { CareRecordConditionMapper } from '@/modules/care-record-condition/mappers/care-record-condition.mapper';
import { CareRecord as PrismaCareRecord } from '@/generated/prisma-client';

export class CareRecordMapper {
  static toDomain(prismaRecord: PrismaCareRecord): CareRecordModel {
    const model = new CareRecordModel();
    model.id = prismaRecord.id;
    model.vehicleModelName = prismaRecord.vehicleModelName;
    model.isInitialConditionRecorded = prismaRecord.isInitialConditionRecorded;
    model.receivedAt = prismaRecord.receivedAt;
    model.confirmedByOwner = prismaRecord.confirmedByOwner;
    model.status = prismaRecord.status as EnumCareRecordStatus;
    model.paymentStatus = prismaRecord.paymentStatus as EnumPaymentStatus;
    model.paymentMethod = prismaRecord.paymentMethod;
    model.totalPrice = prismaRecord.totalPrice;
    model.deliveryDate = prismaRecord.deliveryDate;
    model.deliveryKm = prismaRecord.deliveryKm;
    model.notes = prismaRecord.notes;
    model.appointmentId = prismaRecord.appointmentId;
    model.userVehicleId = prismaRecord.userVehicleId;
    model.technicianId = prismaRecord.technicianId;
    model.storeId = prismaRecord.storeId;

    model.createdAt = prismaRecord.createdAt;
    model.updatedAt = prismaRecord.updatedAt;
    model.deletedAt = prismaRecord.deletedAt;
    model.createdBy = prismaRecord.createdBy;
    model.updatedBy = prismaRecord.updatedBy;
    model.deletedBy = prismaRecord.deletedBy;

    // Parent relations
    if (prismaRecord.appointment) {
      model.appointment = AppointmentMapper.toDomain(prismaRecord.appointment);
    }
    if (prismaRecord.userVehicle) {
      model.userVehicle = UserVehicleMapper.toDomain(prismaRecord.userVehicle);
    }
    if (prismaRecord.technician) {
      model.technician = UserMapper.toDomain(prismaRecord.technician);
    }
    if (prismaRecord.store) {
      model.store = StoreMapper.toDomain(prismaRecord.store);
    }

    // Child relations
    if (
      prismaRecord.careRecordItems &&
      Array.isArray(prismaRecord.careRecordItems)
    ) {
      model.careRecordItems = prismaRecord.careRecordItems.map((i: any) =>
        CareRecordItemMapper.toDomain(i)
      );
    }
    if (
      prismaRecord.careRecordServices &&
      Array.isArray(prismaRecord.careRecordServices)
    ) {
      model.careRecordServices = prismaRecord.careRecordServices.map((s: any) =>
        CareRecordServiceMapper.toDomain(s)
      );
    }
    if (
      prismaRecord.careRecordMedias &&
      Array.isArray(prismaRecord.careRecordMedias)
    ) {
      model.careRecordMedias = prismaRecord.careRecordMedias.map((m: any) =>
        CareRecordMediaMapper.toDomain(m)
      );
    }
    if (prismaRecord.careRecordCondition) {
      model.careRecordCondition = CareRecordConditionMapper.toDomain(
        prismaRecord.careRecordCondition
      );
    }

    return model;
  }
}
