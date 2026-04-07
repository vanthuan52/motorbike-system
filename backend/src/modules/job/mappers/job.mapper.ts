import { JobModel } from '../models/job.model';
import { EnumJobStatus, EnumJobType } from '../enums/job.enum';
import { JobApplicationMapper } from './job-application.mapper';
import { Job as PrismaJob } from '@/generated/prisma-client';

export class JobMapper {
  static toDomain(prismaJob: PrismaJob | any): JobModel {
    const model = new JobModel();
    model.id = prismaJob.id;
    model.title = prismaJob.title;
    model.slug = prismaJob.slug;
    model.description = prismaJob.description;
    model.requirements = prismaJob.requirements;
    model.location = prismaJob.location;
    model.salaryRange = prismaJob.salaryRange;
    model.applicationDeadline = prismaJob.applicationDeadline;
    model.category = prismaJob.category;
    model.jobType = prismaJob.jobType as EnumJobType;
    model.status = prismaJob.status as EnumJobStatus;

    model.createdAt = prismaJob.createdAt;
    model.updatedAt = prismaJob.updatedAt;
    model.deletedAt = prismaJob.deletedAt;
    model.createdBy = prismaJob.createdBy;
    model.updatedBy = prismaJob.updatedBy;
    model.deletedBy = prismaJob.deletedBy;

    if (prismaJob.jobApplications && Array.isArray(prismaJob.jobApplications)) {
      model.jobApplications = prismaJob.jobApplications.map((c: any) =>
        JobApplicationMapper.toDomain(c)
      );
    }

    return model;
  }
}
