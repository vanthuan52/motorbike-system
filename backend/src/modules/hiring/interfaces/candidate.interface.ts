import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import { CandidateDoc, CandidateEntity } from '../entities/candidate.entity';

export interface ICandidateEntity extends Omit<CandidateEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface ICandidateDoc extends Omit<CandidateDoc, 'createdBy'> {
  createdBy: UserDoc;
}
