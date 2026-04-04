import { EnumJobApplicationStatus } from '../enums/job.enum';
import { JobModel } from './job.model';
import { ApplicationReviewModel } from './application-review.model';

/**
 * Domain model representing a job jobApplication.
 * Maps from Prisma JobApplication to application domain layer.
 */
export class JobApplicationModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedAt: Date;
  status: EnumJobApplicationStatus;
  resume?: string;

  jobId: string;
  job?: JobModel;

  // Child relations
  reviews?: ApplicationReviewModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<JobApplicationModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
