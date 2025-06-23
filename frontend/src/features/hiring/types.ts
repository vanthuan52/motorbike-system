import { ApiResponse } from "@/types/api.type";
import { BaseEntity, PaginationQuery } from "@/types/base.type";

export interface Hiring extends BaseEntity {
  _id: string;
  title: string;
  description: string;
  status: string;
  jobType: string;
  category: string;
  location: string;
  applicationDeadline: Date;
  salaryRange: string;
  requirements: string[];
}

export enum ENUM_HIRING_JOB_TYPE {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  ETC = "etc",
}
export enum ENUM_HIRING_STATUS {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
export interface HiringPaginationQuery extends PaginationQuery {
  status?: ENUM_HIRING_STATUS;
}
export interface HiringResponseData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  __v: number;
  title: string;
  description: string;
  status: ENUM_HIRING_STATUS;
  jobType: ENUM_HIRING_JOB_TYPE;
  category: string;
  location: string;
  applicationDeadline: Date;
  salaryRange: string;
  requirements: string[];
}

export type HiringResponse = ApiResponse<HiringResponseData>;

export type HiringDetailResponse = ApiResponse<HiringResponseData>;
