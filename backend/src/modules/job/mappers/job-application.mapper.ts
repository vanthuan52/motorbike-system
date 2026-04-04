import { JobApplicationModel } from '../models/job-application.model';
import { EnumJobApplicationStatus } from '../enums/job.enum';
import { JobMapper } from './job.mapper';
import { ApplicationReviewMapper } from './application-review.mapper';
import { JobApplication as PrismaJobApplication } from '@/generated/prisma-client';

export class JobApplicationMapper {
  static toDomain(prismaJobApplication: PrismaJobApplication): JobApplicationModel {
    const model = new JobApplicationModel();
    model.id = prismaJobApplication.id;
    model.name = prismaJobApplication.name;
    model.email = prismaJobApplication.email;
    model.phone = prismaJobApplication.phone;
    model.appliedAt = prismaJobApplication.appliedAt;
    model.status = prismaJobApplication.status as EnumJobApplicationStatus;
    model.resume = prismaJobApplication.resume;
    model.jobId = prismaJobApplication.jobId;

    model.createdAt = prismaJobApplication.createdAt;
    model.updatedAt = prismaJobApplication.updatedAt;
    model.deletedAt = prismaJobApplication.deletedAt;
    model.createdBy = prismaJobApplication.createdBy;
    model.updatedBy = prismaJobApplication.updatedBy;
    model.deletedBy = prismaJobApplication.deletedBy;

    if (prismaJobApplication.job) {
      model.job = JobMapper.toDomain(prismaJobApplication.job);
    }
    if (prismaJobApplication.reviews && Array.isArray(prismaJobApplication.reviews)) {
      model.reviews = prismaJobApplication.reviews.map((r: any) =>
        ApplicationReviewMapper.toDomain(r)
      );
    }

    return model;
  }
}
