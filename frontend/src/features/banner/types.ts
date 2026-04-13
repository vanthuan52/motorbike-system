import { ApiResponse } from "@/types/api.type";
import { BaseEntity } from "@/types/base.type";

export enum ENUM_BANNER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Banner extends BaseEntity {
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  linkText?: string;
  order: number;
  status: ENUM_BANNER_STATUS;
}

// list
export type BannerListResponse = ApiResponse<Banner[]>;
