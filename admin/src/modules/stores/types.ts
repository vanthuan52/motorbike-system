import { ApiResponse } from "@/types/api.type";
import { PaginationQuery } from "@/types/base.type";

export enum ENUM_STORE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Store {
  _id: string;
  name: string;
  address: string;
  workHours: string;
  slug: string;
  status: ENUM_STORE_STATUS;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export interface StorePaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_STORE_STATUS;
}

export interface StoreResponseData {
  name: string;
  address: string;
  workHours: string;
  slug: string;
  status: ENUM_STORE_STATUS;
}

export type StoreResponse = ApiResponse<StoreResponseData>;

export interface StoreDetailResponse extends ApiResponse<Store> {}

export type StoreListResponse = ApiResponse<Store[]>;

export type StoreCreationResponse = ApiResponse<Store["_id"]>;

export type StoreUpdateResponse = ApiResponse;

export type StoreDeleteResponse = ApiResponse;

export type StoreUpdateStatusResponse = ApiResponse;
