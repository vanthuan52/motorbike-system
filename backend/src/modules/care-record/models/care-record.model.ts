import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';
import { AppointmentModel } from '@/modules/appointment/models/appointment.model';
import { UserVehicleModel } from '@/modules/user-vehicle/models/user-vehicle.model';
import { UserModel } from '@/modules/user/models/user.model';
import { StoreModel } from '@/modules/store/models/store.model';
import { CareRecordItemModel } from '@/modules/care-record-item/models/care-record-item.model';
import { CareRecordServiceModel } from '@/modules/care-record-service/models/care-record-service.model';
import { CareRecordMediaModel } from '@/modules/care-record-media/models/care-record-media.model';
import { CareRecordConditionModel } from '@/modules/care-record-condition/models/care-record-condition.model';

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
  appointment?: AppointmentModel;
  userVehicleId: string;
  userVehicle?: UserVehicleModel;
  technicianId?: string;
  technician?: UserModel;
  storeId?: string;
  store?: StoreModel;

  // Child relations
  careRecordItems?: CareRecordItemModel[];
  careRecordServices?: CareRecordServiceModel[];
  careRecordMedias?: CareRecordMediaModel[];
  careRecordCondition?: CareRecordConditionModel;

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
