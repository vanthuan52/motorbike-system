import { EnumAppointmentStatus } from '../enums/appointment.enum';
import { UserModel } from '@/modules/user/models/user.model';
import { UserVehicleModel } from '@/modules/user-vehicle/models/user-vehicle.model';
import { VehicleModelModel } from '@/modules/vehicle-model/models/vehicle-model.model';
import { VehicleServiceModel } from '@/modules/vehicle-service/models/vehicle-service.model';

/**
 * Domain model representing a service appointment.
 * Maps from Prisma Appointment to application domain layer.
 */
export class AppointmentModel {
  id: string;
  name: string;
  phone: string;
  licensePlateNumber?: string;
  address?: string;
  customerRequests: string[];
  note?: string;
  appointmentDate: Date;
  status: EnumAppointmentStatus;

  userId?: string;
  user?: UserModel;
  userVehicleId?: string;
  userVehicle?: UserVehicleModel;
  vehicleModelId: string;
  vehicleModel?: VehicleModelModel;
  vehicleServices?: VehicleServiceModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<AppointmentModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
