import { Model, PopulateOptions } from 'mongoose';

import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import {
  CandidateReviewDoc,
  CandidateReviewEntity,
} from '../entities/candidate-review.entity';

export class CandidateReviewRepository extends DatabaseRepositoryBase<
  CandidateReviewEntity,
  CandidateReviewDoc
> {
  readonly _joinActive: PopulateOptions[] = [];
  constructor(
    @InjectDatabaseModel(CandidateReviewEntity.name)
    private readonly candidateReviewModel: Model<CandidateReviewEntity>,
  ) {
    super(candidateReviewModel);
  }
}
