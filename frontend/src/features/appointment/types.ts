import { ApiResponse } from "@/types/api.type";
import { BaseEntity } from "@/types/base.type";

export enum ENUM_APPOINTMENTS_STATUS {
  PENDING = "pending",
  UPCOMING = "upcoming",
  DONE = "done",
}

export interface Appointment extends BaseEntity {
  user?: string;
  userVehicle?: string;
  name: string;
  phone: string;
  vehicleModel: string;
  vehicleServices: string[];
  licensePlate: string;
  appointmentDate: Date;
  address?: string;
  note?: string;
  status?: ENUM_APPOINTMENTS_STATUS;
}

export interface FormValuesAppointments
  extends Omit<Appointment, "appointmentDate"> {
  date: Date;
  time: string;
}

export interface AppointmentsPaginationQuery extends BaseEntity {
  status?: ENUM_APPOINTMENTS_STATUS;
}

export type AppointmentsCreationResponse = ApiResponse<Appointment["_id"]>;
