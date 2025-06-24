import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export enum ENUM_PART_TYPE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface PartType extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: ENUM_PART_TYPE_STATUS;
  photo?: string;
  vehicle_company_id?: string;
}

export interface PartTypePaginationQuery extends PaginationQuery {
  status?: ENUM_PART_TYPE_STATUS;
}

// list
export type PartTypeListResponse = ApiResponse<PartType[]>;

// detail
export type PartTypeDetailResponse = ApiResponse<PartType>;
