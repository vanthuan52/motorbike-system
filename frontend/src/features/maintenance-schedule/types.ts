import { ApiResponse } from "@/types/api.type";
import { BaseEntity } from "@/types/base.type";

export enum ENUM_MAINTENANCE_SCHEDULE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface MaintenanceSchedule extends BaseEntity {
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

export interface MaintenanceSchedulePaginationQuery extends BaseEntity {
  status?: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}

export type MaintenanceScheduleCreationResponse = ApiResponse<
  MaintenanceSchedule["_id"]
>;
