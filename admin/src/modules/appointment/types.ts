import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { ServiceCategory } from "../service-category/types";
import { VehicleModel } from "../vehicle-model/types";
import { VehicleBrand } from "../vehicle-brand/types";

export enum ENUM_APPOINTMENTS_STATUS {
  PENDING = "pending",
  UPCOMING = "upcoming",
  DONE = "done",
}

export interface Appointments extends BaseEntity {
  user?: string;
  userVehicle?: string[];
  name: string;
  phone: string;
  vehicleModel: VehicleModel;
  vehicleServices: ServiceCategory[];
  licensePlate: string;
  appointmentDate: Date;
  address?: string;
  note?: string;
  status?: ENUM_APPOINTMENTS_STATUS;
}

export interface FormValuesAppointments
  extends Omit<Appointments, "appointmentDate"> {
  date: Date;
  time: string;
}

export interface AppointmentsPaginationQuery extends PaginationQuery {
  status?: ENUM_APPOINTMENTS_STATUS;
  serviceCategory?: string;
}

export interface AppointmentsResponseData extends BaseEntity {
  customer: string;
  phone: string;
  vehicleBrand: VehicleBrand;
  vehicleModel: VehicleModel;
  serviceCategory: ServiceCategory[];
  vehicleNumber: string;
  scheduleDate: Date;
  timeSlot: string;
  address?: string;
  note?: string;
  status?: ENUM_APPOINTMENTS_STATUS;
}

export type AppointmentsResponse = ApiResponse<AppointmentsResponseData>;

export interface AppointmentsDetailResponse extends ApiResponse<Appointments> {}

export type AppointmentsListResponse = ApiResponse<Appointments[]>;

export type AppointmentsCreationResponse = ApiResponse<Appointments["_id"]>;

export type AppointmentsUpdateResponse = ApiResponse;

export type AppointmentsDeleteResponse = ApiResponse;

export type AppointmentsUpdateStatusResponse = ApiResponse;
