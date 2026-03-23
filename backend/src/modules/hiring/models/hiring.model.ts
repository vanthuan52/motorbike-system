import { EnumHiringJobType, EnumHiringStatus } from '../enums/hiring.enum';

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
}
