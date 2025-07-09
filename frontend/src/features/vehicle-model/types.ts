import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { VehicleBrand } from "../vehicle-brand/types";

export enum ENUM_VEHICLE_MODEL_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ENUM_VEHICLE_MODEL_TYPE {
  UNKNOWN = "unknown",
  SCOOTER = "scooter",
  MANUAL = "manual",
  SLUTCH = "slutch",
  ELECTRIC = "electric",
}

export enum ENUM_VEHICLE_MODEL_FUEL_TYPE {
  UNKNOWN = "unknown",
  GASOLINE = "gasoline",
  HYBRID = "hybrid",
  ELECTRIC = "electric",
}

export interface VehicleModel extends BaseEntity {
  name: string;
  fullName: string;
  slug: string;
  description?: string;
  status: ENUM_VEHICLE_MODEL_STATUS;
  order?: string;
  vehicleBrand: VehicleBrand;
  photo?: string;
  type?: ENUM_VEHICLE_MODEL_TYPE;
  fuelType?: ENUM_VEHICLE_MODEL_FUEL_TYPE;
  yearStart?: number;
  yearEnd?: number;
}

export interface VehicleModelPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_VEHICLE_MODEL_STATUS;
  vehicleBrand?: string;
}

export interface VehicleModelResponseData extends VehicleModel {}

export type VehicleModelResponse = ApiResponse<VehicleModelResponseData>;

export interface VehicleModelDetailResponse extends ApiResponse<VehicleModel> {}

export type VehicleModelListResponse = ApiResponse<VehicleModel[]>;

export type VehicleModelCreationResponse = ApiResponse<VehicleModel["_id"]>;

export type VehicleModelUpdateResponse = ApiResponse;

export type VehicleModelDeleteResponse = ApiResponse;

export type VehicleModelUpdateStatusResponse = ApiResponse;
