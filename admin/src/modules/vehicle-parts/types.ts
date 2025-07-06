import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_PART_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export interface VehiclePart extends BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deleted?: boolean;
  name: string;
  slug: string;
  description?: string;
  status: ENUM_PART_STATUS;
  order?: string;
  partType: string;
  vehicleBrand: string;
}

export interface PartPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_PART_STATUS;
  partType?: string;
  vehicleBrand?: string;
}

export interface PartResponseData extends VehiclePart {}

export interface VehiclePartPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_PART_STATUS;
  partType?: string;
  vehicleBrand?: string;
}

export type PartResponse = ApiResponse<PartResponseData>;

export interface PartDetailResponse extends ApiResponse<VehiclePart> {}

export type PartListResponse = ApiResponse<VehiclePart[]>;

export type PartCreationResponse = ApiResponse<VehiclePart["_id"]>;

export type PartUpdateResponse = ApiResponse;

export type PartDeleteResponse = ApiResponse;

export type PartUpdateStatusResponse = ApiResponse;
