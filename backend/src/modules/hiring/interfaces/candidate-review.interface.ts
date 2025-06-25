import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import { CandidateEntity } from '../entities/candidate.entity';

export interface ICandidateReviewEntity
  extends Omit<CandidateEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface ICandidateReviewDoc
  extends Omit<CandidateEntity, 'createdBy'> {
  createdBy: UserDoc;
}
