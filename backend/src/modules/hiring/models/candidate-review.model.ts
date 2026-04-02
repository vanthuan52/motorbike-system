import { UserModel } from '@/modules/user/models/user.model';
import { CandidateModel } from './candidate.model';

/**
 * Domain model representing a candidate review/feedback.
 * Maps from Prisma CandidateReview to application domain layer.
 */
export class CandidateReviewModel {
  id: string;
  feedback: string;
  rating?: number;

  userId: string;
  user?: UserModel;
  candidateId: string;
  candidate?: CandidateModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CandidateReviewModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
