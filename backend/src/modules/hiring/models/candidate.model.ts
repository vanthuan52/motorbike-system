import { EnumCandidateStatus } from '../enums/hiring.enum';
import { HiringModel } from './hiring.model';
import { CandidateReviewModel } from './candidate-review.model';

/**
 * Domain model representing a job candidate.
 * Maps from Prisma Candidate to application domain layer.
 */
export class CandidateModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: Date;
  status: EnumCandidateStatus;
  resume?: string;

  hiringId: string;
  hiring?: HiringModel;

  // Child relations
  reviews?: CandidateReviewModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CandidateModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
