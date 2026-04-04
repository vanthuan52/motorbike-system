import { EnumJobApplicationStatus, EnumJobStatus, EnumJobType } from '../enums/job.enum';

export const JobDefaultStatus = [
  EnumJobStatus.draft,
  EnumJobStatus.published,
  EnumJobStatus.archived,
];

export const JobDefaultJobType = [
  EnumJobType.fullTime,
  EnumJobType.partTime,
  EnumJobType.contract,
  EnumJobType.etc,
];

export const JobDefaultAvailableSearch = ['title', 'status'];

export const JobApplicationDefaultStatus = Object.values(EnumJobApplicationStatus);
