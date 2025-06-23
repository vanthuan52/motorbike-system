import { ApiResponse } from "@/types/api.type";
import { BaseEntity } from "@/types/base.type";

export interface Category extends BaseEntity {
  deleted?: boolean;
  name: string;
  slug: string;
  description?: string;
  status: ENUM_PART_TYPE_STATUS;
  photo?: string;
  vehicle_company_id?: string;
}
export enum ENUM_PART_TYPE_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
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
