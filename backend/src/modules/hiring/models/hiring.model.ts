import { EnumHiringJobType, EnumHiringStatus } from '../enums/hiring.enum';

/**
 * Domain model representing a hiring/job posting.
 * Maps from Prisma Hiring to application domain layer.
 */
export class HiringModel {
  id: string;
  title: string;
  slug: string;
  description?: string;
  requirements: string[];
  location: string;
  salaryRange: string;
  applicationDeadline: Date;
  category: string;
  jobType: EnumHiringJobType;
  status: EnumHiringStatus;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<HiringModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumHiringStatus.published && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
