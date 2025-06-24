import { BaseEntity, PaginationQuery } from "@/types/base.type";
import { ApiResponse } from "@/types/api.type";

export enum ENUM_CANDIDATE_STATUS {
  NEW = "new",
  REVIEWED = "reviewed",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  REJECTED = "rejected",
  HIRED = "hired",
}

export interface CandidatePaginationQuery extends PaginationQuery {
  status?: ENUM_CANDIDATE_STATUS;
  hiringId?: string;
  search?: string;
}

export interface Candidate extends BaseEntity {
  hiringId: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: Date;
  status: ENUM_CANDIDATE_STATUS;
  cv?: string;
  experience?: string;
  education?: string;
  interactions?: string[];
}

export type CandidateListResponse = ApiResponse<Candidate[]>;

export type CandidateDetailResponse = ApiResponse<Candidate>;

export type CandidateCreationResponse = ApiResponse<Candidate["_id"]>;

export type CandidateUpdateResponse = ApiResponse;

export type CandidateUpdateStatusResponse = ApiResponse;

export type CandidateDeletionResponse = ApiResponse;
