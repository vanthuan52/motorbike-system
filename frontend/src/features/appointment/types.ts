import { ApiResponse } from "@/types/api.type";
import { BaseEntity } from "@/types/base.type";

export enum ENUM_MAINTENANCE_SCHEDULE_STATUS {
  PENDING = "pending",
  UPCOMING = "upcoming",
  DONE = "done",
}

export interface Appointments extends BaseEntity {
  customer: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  serviceCategories: string[];
  vehicleNumber: string;
  scheduleDate: Date;
  timeSlot: string;
  address: string;
  note?: string;
  status?: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}

export interface AppointmentsPaginationQuery extends BaseEntity {
  status?: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}

export type AppointmentsCreationResponse = ApiResponse<Appointments["_id"]>;
