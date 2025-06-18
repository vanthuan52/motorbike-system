import { ApiResponse } from "@/types/api.type";

export enum JobTypeEnum {
  FullTime = "Full-time",
  PartTime = "Part-time",
}
export enum HiringStatusEnum {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}
export interface Hiring {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  __v: number;
  title: string;
  job_type: JobTypeEnum;
  requirements?: string[];
  salary_range?: string;
  application_deadline: string;
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
  job_type: JobTypeEnum;
  requirements?: string[];
  salary_range?: string;
  application_deadline?: string;
  category: string;
  location: string;
  description: string;
  status: HiringStatusEnum;
}

export type HiringResponse = ApiResponse<HiringResponseData>;
