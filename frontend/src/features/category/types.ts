import { ApiResponse } from "@/types/api.type";

export interface Category {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  __v?: number;
  name: string;
  slug: string;
  description?: string;
  status: PartTypeStatus;
  photo?: string;
  vehicle_company_id?: string;
}
export enum PartTypeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}
export interface Order {
  orderBy?: string;
  orderDirection?: OrderDirection;
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
  status: PartTypeStatus;
  photo?: string;
}

export type PartTypeResponse = ApiResponse<PartTypeResponseData>;
