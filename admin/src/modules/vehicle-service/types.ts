import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { ServiceCategory } from "../service-category/types";

export enum ENUM_VEHICLE_SERVICE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface VehicleService extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: ENUM_VEHICLE_SERVICE_STATUS;
  order?: string;
  serviceCategory: ServiceCategory;
  photo?: string;
}

export interface VehicleServicePaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_VEHICLE_SERVICE_STATUS;
}

export interface VehicleServiceResponseData extends VehicleService {}

export type VehicleServiceResponse = ApiResponse<VehicleServiceResponseData>;

export interface VehicleServiceDetailResponse
  extends ApiResponse<VehicleService> {}

export type VehicleServiceListResponse = ApiResponse<VehicleService[]>;

export type VehicleServiceCreationResponse = ApiResponse<VehicleService["_id"]>;

export type VehicleServiceUpdateResponse = ApiResponse;

export type VehicleServiceDeleteResponse = ApiResponse;

export type VehicleServiceUpdateStatusResponse = ApiResponse;
