export class CandidateReviewModel {
  id: string;
  feedback: string;
  rating?: number;
  userId: string;
  candidateId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
