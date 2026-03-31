import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';

/**
 * Domain model representing a vehicle care record.
 * Maps from Prisma CareRecord to application domain layer.
 */
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

  constructor(data?: Partial<CareRecordModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
