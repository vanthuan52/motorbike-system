import { CandidateReviewModel } from '../models/candidate-review.model';

export class CandidateReviewMapper {
  static toDomain(prismaReview: any): CandidateReviewModel {
    const model = new CandidateReviewModel();
    model.id = prismaReview.id;
    model.feedback = prismaReview.feedback;
    model.rating = prismaReview.rating;
    model.userId = prismaReview.userId;
    model.candidateId = prismaReview.candidateId;

    model.createdAt = prismaReview.createdAt;
    model.updatedAt = prismaReview.updatedAt;
    model.deletedAt = prismaReview.deletedAt;
    model.createdBy = prismaReview.createdBy;
    model.updatedBy = prismaReview.updatedBy;
    model.deletedBy = prismaReview.deletedBy;

    return model;
  }
}
