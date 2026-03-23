import { EnumCareRecordStatus, EnumPaymentStatus } from '../enums/care-record.enum';

export class CareRecordModel {
  id: string;
  vehicleModelName?: string;
  isInitialConditionRecorded: boolean;
  receivedAt?: Date;
  confirmedByOwner: boolean;
  status: EnumCareRecordStatus;
  paymentStatus?: EnumPaymentStatus;
  paymentMethod?: string;
  totalPrice?: number;
  deliveryDate?: Date;
  deliveryKm?: number;
  notes?: string;
  appointmentId?: string;
  userVehicleId: string;
  technicianId?: string;
  storeId?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
