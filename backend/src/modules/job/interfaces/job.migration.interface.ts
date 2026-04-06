import { EnumJobStatus, EnumJobType } from '../enums/job.enum';

/**
 * Payload interface for migration seed — create a job record.
 * Intended for use in migration seeds only; does not require requestLog or createdBy.
 * Note: applicationDeadline accepts Date directly (not string like the request DTO).
 */
export interface IJobMigrationCreate {
  title: string;
  description?: string;
  requirements: string[];
  location: string;
  salaryRange: string;
  applicationDeadline: Date;
  category: string;
  jobType: EnumJobType;
  status?: EnumJobStatus;
}
