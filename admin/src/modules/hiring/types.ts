import { ApiResponse } from "@/types/api.type";
import { PaginationQuery } from "@/types/base.type";

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

export interface Hiring {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  __v: number;
  title: string;
  slug: string;
  jobType: ENUM_HIRING_JOB_TYPE;
  requirements?: string[];
  salaryRange?: string;
  applicationDeadline: string;
  category: string;
  location: string;
  description: string;
  status: ENUM_HIRING_STATUS;
}

export interface HiringPaginationQuery extends PaginationQuery {
  status?: ENUM_HIRING_STATUS;
  jobType?: ENUM_HIRING_JOB_TYPE;
}
export interface HiringResponseData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  __v: number;
  title: string;
  slug: string;
  jobType: ENUM_HIRING_JOB_TYPE;
  requirements?: string[];
  salaryRange?: string;
  applicationDeadline?: string;
  category: string;
  location: string;
  description: string;
  status: ENUM_HIRING_STATUS;
}

export type HiringResponse = ApiResponse<HiringResponseData>;

export interface HiringDetailResponse extends ApiResponse<Hiring> {}

export type HiringListResponse = ApiResponse<Hiring[]>;

export type HiringCreationResponse = ApiResponse<Hiring["_id"]>;

export type HiringUpdateResponse = ApiResponse;

export type HiringDeleteResponse = ApiResponse;

export type HiringUpdateStatusResponse = ApiResponse;
