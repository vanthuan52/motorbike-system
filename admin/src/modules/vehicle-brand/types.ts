import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_VEHICLE_BRAND_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface VehicleBrand extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: ENUM_VEHICLE_BRAND_STATUS;
  order?: string;
  country?: string;
  photo?: string;
}

export interface VehicleBrandPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_VEHICLE_BRAND_STATUS;
}

export interface VehicleBrandResponseData extends VehicleBrand {}

export type VehicleBrandResponse = ApiResponse<VehicleBrandResponseData>;

export interface VehicleBrandDetailResponse extends ApiResponse<VehicleBrand> {}

export type VehicleBrandListResponse = ApiResponse<VehicleBrand[]>;

export type VehicleBrandCreationResponse = ApiResponse<VehicleBrand["_id"]>;

export type VehicleBrandUpdateResponse = ApiResponse;

export type VehicleBrandDeleteResponse = ApiResponse;

export type VehicleBrandUpdateStatusResponse = ApiResponse;
