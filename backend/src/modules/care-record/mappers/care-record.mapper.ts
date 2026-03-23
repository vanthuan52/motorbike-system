import { CareRecordModel } from '../models/care-record.model';
import { EnumCareRecordStatus, EnumPaymentStatus } from '../enums/care-record.enum';

export class CareRecordMapper {
  static toDomain(prismaRecord: any): CareRecordModel {
    const model = new CareRecordModel();
    model.id = prismaRecord.id;
    model.vehicleModelName = prismaRecord.vehicleModelName;
    model.isInitialConditionRecorded = prismaRecord.isInitialConditionRecorded;
    model.receivedAt = prismaRecord.receivedAt;
    model.confirmedByOwner = prismaRecord.confirmedByOwner;
    const statusMap: Record<string, EnumCareRecordStatus> = {
      PENDING: EnumCareRecordStatus.pending,
      IN_PROGRESS: EnumCareRecordStatus.inProgress,
      COMPLETED: EnumCareRecordStatus.completed,
      CANCEL: EnumCareRecordStatus.cancel,
    };
    model.status = statusMap[prismaRecord.status] || EnumCareRecordStatus.pending;
    model.paymentStatus = prismaRecord.paymentStatus?.toLowerCase() as EnumPaymentStatus;
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

    return model;
  }
}
