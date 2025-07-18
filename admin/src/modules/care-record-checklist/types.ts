import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { CareRecord } from "../care-record/types";
import { ServiceChecklist } from "../service-checklist/types";

export enum ENUM_CARE_RECORD_CHECKLIST_STATUS {
  UNCHECKED = "unchecked",
  CHECKED = "checked",
  REPLACED = "replaced",
  SKIPPED = "skipped",
}

export enum ENUM_PAYMENT_STATUS {
  PAID = "paid",
  UNPAID = "unpaid",
}

export interface CareRecordChecklist extends BaseEntity {
  careRecord: CareRecord;
  serviceChecklist: ServiceChecklist;
  status: ENUM_CARE_RECORD_CHECKLIST_STATUS;
  note?: string;
  wearPercentage?: number;
  imageBefore?: string;
  imageAfter?: string;
}

export interface CareRecordChecklistPaginationQuery extends PaginationQuery {
  careRecord?: string;
  status?: ENUM_CARE_RECORD_CHECKLIST_STATUS;
}

export interface CareRecordChecklistResponseData extends CareRecordChecklist {
  CareRecordChecklists: CareRecordChecklist;
}

export type CareRecordChecklistResponse =
  ApiResponse<CareRecordChecklistResponseData>;

export interface CareRecordChecklistDetailResponse
  extends ApiResponse<CareRecordChecklist> {}

export type CareRecordChecklistListResponse = ApiResponse<
  CareRecordChecklist[]
>;

export type CareRecordChecklistCreationResponse = ApiResponse<
  CareRecordChecklist["_id"]
>;

export type CareRecordChecklistUpdateResponse = ApiResponse;

export type CareRecordChecklistDeleteResponse = ApiResponse;

export type CareRecordChecklistUpdateStatusResponse = ApiResponse;
