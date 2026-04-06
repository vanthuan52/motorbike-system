import { ApplicationReviewModel } from '../models/application-review.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { JobApplicationMapper } from './job-application.mapper';
import { ApplicationReview as PrismaApplicationReview } from '@/generated/prisma-client';

export class ApplicationReviewMapper {
  static toDomain(
    prismaReview: PrismaApplicationReview
  ): ApplicationReviewModel {
    const model = new ApplicationReviewModel();
    model.id = prismaReview.id;
    model.feedback = prismaReview.feedback;
    model.rating = prismaReview.rating;
    model.userId = prismaReview.userId;
    model.jobApplicationId = prismaReview.jobApplicationId;

    model.createdAt = prismaReview.createdAt;
    model.updatedAt = prismaReview.updatedAt;
    model.deletedAt = prismaReview.deletedAt;
    model.createdBy = prismaReview.createdBy;
    model.updatedBy = prismaReview.updatedBy;
    model.deletedBy = prismaReview.deletedBy;

    if (prismaReview.user) {
      model.user = UserMapper.toDomain(prismaReview.user);
    }
    if (prismaReview.jobApplication) {
      model.jobApplication = JobApplicationMapper.toDomain(
        prismaReview.jobApplication
      );
    }

    return model;
  }
}
