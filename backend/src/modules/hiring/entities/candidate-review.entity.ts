import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const CandidateReviewTableName = 'candidate_reviews';

@DatabaseEntity({ collection: CandidateReviewTableName })
export class CandidateReviewEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: 'users',
    index: true,
  })
  user: string;

  @DatabaseProp({
    required: true,
    ref: 'candidates',
    index: true,
  })
  candidate: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 1000,
  })
  feedback: string;
}

export const CandidateReviewSchema = DatabaseSchema(CandidateReviewEntity);

export type CandidateReviewDoc = IDatabaseDocument<CandidateReviewEntity>;
