export enum JobTypeEnum {
  FullTime = "Full-time",
  PartTime = "Part-time",
}
export enum JobStatusEnum {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}
export interface CareerJob {
  id: string;
  title: string;
  job_type: JobTypeEnum;
  requirements?: string[];
  salary_range?: string;
  application_deadline?: string;
  category: string;
  location: string;
  description: string;
  tag: string;
  status: JobStatusEnum;
}
