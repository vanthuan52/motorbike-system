import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { Appointments } from "../appointment/types";
import { UserVehicle } from "../user-vehicle/types";
import { User } from "../user/types";
import { Store } from "../stores/types";

export enum ENUM_CARE_RECORD_STATUS {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  CANCEL = "cancel",
}

export enum ENUM_PAYMENT_STATUS {
  PAID = "paid",
  UNPAID = "unpaid",
}

export interface CareRecordCardProps {
  record: CareRecord;
  onView: () => void;
  onDelete?: () => void;
}
export interface CareRecord extends BaseEntity {
  appointment: Appointments;
  userVehicle: UserVehicle;
  technician?: User;
  store?: Store;
  receivedAt: Date;
  confirmedByOwner: boolean;
  status: ENUM_CARE_RECORD_STATUS;
  handoverTime?: Date;
  paymentStatus: ENUM_PAYMENT_STATUS;
  totalCost?: number;
}

export interface CareRecordPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_CARE_RECORD_STATUS;
  paymentStatus?: ENUM_PAYMENT_STATUS;
}

export interface CareRecordResponseData extends CareRecord {
  careRecords: CareRecord;
}

export type CareRecordResponse = ApiResponse<CareRecordResponseData>;

export interface CareRecordDetailResponse extends ApiResponse<CareRecord> {}

export type CareRecordListResponse = ApiResponse<CareRecord[]>;

export type CareRecordCreationResponse = ApiResponse<CareRecord["_id"]>;

export type CareRecordUpdateResponse = ApiResponse;

export type CareRecordDeleteResponse = ApiResponse;

export type CareRecordUpdateStatusResponse = ApiResponse;
