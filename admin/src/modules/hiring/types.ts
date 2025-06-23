import { ApiResponse } from "@/types/api.type";

export enum JobTypeEnum {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  ETC = "etc",
}
export enum HiringStatusEnum {
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
  jobType: JobTypeEnum;
  requirements?: string[];
  salaryRange?: string;
  applicationDeadline: string;
  category: string;
  location: string;
  description: string;
  status: HiringStatusEnum;
}
export interface HiringResponseData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  __v: number;
  title: string;
  jobType: JobTypeEnum;
  requirements?: string[];
  salaryRange?: string;
  applicationDeadline?: string;
  category: string;
  location: string;
  description: string;
  status: HiringStatusEnum;
}

export type HiringResponse = ApiResponse<HiringResponseData>;
