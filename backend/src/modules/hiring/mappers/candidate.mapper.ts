import { CandidateModel } from '../models/candidate.model';
import { EnumCandidateStatus } from '../enums/hiring.enum';
import { HiringMapper } from './hiring.mapper';
import { CandidateReviewMapper } from './candidate-review.mapper';

export class CandidateMapper {
  static toDomain(prismaCandidate: any): CandidateModel {
    const model = new CandidateModel();
    model.id = prismaCandidate.id;
    model.name = prismaCandidate.name;
    model.email = prismaCandidate.email;
    model.phone = prismaCandidate.phone;
    model.appliedAt = prismaCandidate.appliedAt;
    model.status = prismaCandidate.status?.toLowerCase() as EnumCandidateStatus;
    model.resume = prismaCandidate.resume;
    model.hiringId = prismaCandidate.hiringId;

    model.createdAt = prismaCandidate.createdAt;
    model.updatedAt = prismaCandidate.updatedAt;
    model.deletedAt = prismaCandidate.deletedAt;
    model.createdBy = prismaCandidate.createdBy;
    model.updatedBy = prismaCandidate.updatedBy;
    model.deletedBy = prismaCandidate.deletedBy;

    if (prismaCandidate.hiring) {
      model.hiring = HiringMapper.toDomain(prismaCandidate.hiring);
    }
    if (prismaCandidate.reviews && Array.isArray(prismaCandidate.reviews)) {
      model.reviews = prismaCandidate.reviews.map((r: any) =>
        CandidateReviewMapper.toDomain(r)
      );
    }

    return model;
  }
}
