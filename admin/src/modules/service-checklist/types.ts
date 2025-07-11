import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_SERVICE_CHECKLIST_AREA {
  ENGINE = "engine",
  TRANSMISSION = "transmission",
  SUSPENSION = "suspension",
  BRAKE = "brake",
  WHEEL = "wheel",
  ELECTRIC = "electric",
  FUEL = "fuel",
  COOLING = "cooling",
  FRAME = "frame",
  BODY_CARE = "body_care",
}

export interface ServiceChecklist extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  area: ENUM_SERVICE_CHECKLIST_AREA;
  order?: string;
}

export interface ServiceChecklistPaginationQuery extends PaginationQuery {
  name?: string;
  area?: ENUM_SERVICE_CHECKLIST_AREA;
}

export interface ServiceChecklistResponseData extends ServiceChecklist {
  name: string;
  code: string;
  description?: string;
  order?: string;
  area: ENUM_SERVICE_CHECKLIST_AREA;
}

export type ServiceChecklistResponse =
  ApiResponse<ServiceChecklistResponseData>;

export interface ServiceChecklistDetailResponse
  extends ApiResponse<ServiceChecklist> {}

export type ServiceChecklistListResponse = ApiResponse<ServiceChecklist[]>;

export type ServiceChecklistCreationResponse = ApiResponse<
  ServiceChecklist["_id"]
>;

export type ServiceChecklistUpdateResponse = ApiResponse;

export type ServiceChecklistDeleteResponse = ApiResponse;
