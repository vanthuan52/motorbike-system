import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_CANDIDATE_STATUS } from '../enums/candidate.enum';

export const CandidateTableName = 'candidates';

@DatabaseEntity({ collection: CandidateTableName })
export class CandidateEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    type: String,
    ref: 'hiring',
    index: true,
  })
  hiring: String;

  @DatabaseProp({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @DatabaseProp({
    required: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 20,
    minlength: 8,
  })
  phone: string;

  @DatabaseProp({
    required: true,
    type: Date,
  })
  appliedAt: Date;

  @DatabaseProp({
    required: true,
    default: ENUM_CANDIDATE_STATUS.NEW,
    enum: ENUM_CANDIDATE_STATUS,
    type: String,
    index: true,
  })
  status: ENUM_CANDIDATE_STATUS;

  @DatabaseProp({ required: false })
  cv?: string;

  @DatabaseProp({ required: false })
  cvMimeType?: string;

  @DatabaseProp({ required: false })
  cvFileName?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 1000,
  })
  experience?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 1000,
  })
  education?: string;

  @DatabaseProp({
    required: false,
    type: [String],
    default: [],
  })
  interactions?: string[];
}

export const CandidateSchema = DatabaseSchema(CandidateEntity);

export type CandidateDoc = IDatabaseDocument<CandidateEntity>;
