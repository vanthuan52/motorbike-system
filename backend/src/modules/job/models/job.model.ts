import { EnumJobType, EnumJobStatus } from '../enums/job.enum';
import { JobApplicationModel } from './job-application.model';

/**
 * Domain model representing a job/job posting.
 * Maps from Prisma Job to application domain layer.
 */
export class JobModel {
  id: string;
  title: string;
  slug: string;
  description?: string;
  requirements: string[];
  location: string;
  salaryRange: string;
  applicationDeadline: Date;
  category: string;
  jobType: EnumJobType;
  status: EnumJobStatus;

  // Child relations
  jobApplications?: JobApplicationModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<JobModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumJobStatus.published && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
