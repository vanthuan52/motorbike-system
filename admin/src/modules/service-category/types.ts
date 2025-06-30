import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_SERVICE_CATEGORY_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface ServiceCategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: ENUM_SERVICE_CATEGORY_STATUS;
  order?: string;
}

export interface ServiceCategoryPaginationQuery extends PaginationQuery {
  name?: string;
  status?: ENUM_SERVICE_CATEGORY_STATUS;
}

export interface ServiceCategoryResponseData extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  order?: string;
  status: ENUM_SERVICE_CATEGORY_STATUS;
}

export type ServiceCategoryResponse = ApiResponse<ServiceCategoryResponseData>;

export interface ServiceCategoryDetailResponse
  extends ApiResponse<ServiceCategory> {}

export type ServiceCategoryListResponse = ApiResponse<ServiceCategory[]>;

export type ServiceCategoryCreationResponse = ApiResponse<
  ServiceCategory["_id"]
>;

export type ServiceCategoryUpdateResponse = ApiResponse;

export type ServiceCategoryDeleteResponse = ApiResponse;

export type ServiceCategoryUpdateStatusResponse = ApiResponse;
