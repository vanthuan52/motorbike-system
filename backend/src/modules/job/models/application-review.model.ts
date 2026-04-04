import { UserModel } from '@/modules/user/models/user.model';
import { JobApplicationModel } from './job-application.model';

/**
 * Domain model representing a jobApplication review/feedback.
 * Maps from Prisma ApplicationReview to application domain layer.
 */
export class ApplicationReviewModel {
  id: string;
  feedback: string;
  rating?: number;

  userId: string;
  user?: UserModel;
  jobApplicationId: string;
  jobApplication?: JobApplicationModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<ApplicationReviewModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
