import { EnumAppointmentStatus } from '../enums/appointment.enum';

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
  userVehicleId?: string;
  vehicleModelId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
