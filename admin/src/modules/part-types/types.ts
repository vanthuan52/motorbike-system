import { ApiResponse } from "@/types/api.type";
import { PaginationQuery } from "@/types/base.type";

export enum ENUM_PART_TYPE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface PartType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  deleted?: boolean;
  name: string;
  slug: string;
  description?: string;
  status: ENUM_PART_TYPE_STATUS;
  photo?: string;
  vehicle_company_id?: string;
}

export interface PartTypePaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_PART_TYPE_STATUS;
}

export interface PartTypeResponseData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  __v: number;
  name: string;
  slug: string;
  description?: string;
  status: ENUM_PART_TYPE_STATUS;
  photo?: string;
}

export type PartTypeResponse = ApiResponse<PartTypeResponseData>;

export interface PartTypeDetailResponse extends ApiResponse<PartType> {}

export type PartTypeListResponse = ApiResponse<PartType[]>;

export type PartTypeCreationResponse = ApiResponse<PartType["_id"]>;

export type PartTypeUpdateResponse = ApiResponse;

export type PartTypeDeleteResponse = ApiResponse;

export type PartTypeUpdateStatusResponse = ApiResponse;
