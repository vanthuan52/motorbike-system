import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_HIRING_STATUS, ENUM_HIRING_TYPE } from '../enums/hiring.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const HiringTableName = 'hiring';

@DatabaseEntity({ collection: HiringTableName })
export class HiringEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  title: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  slug: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    trim: true,
    type: [String],
  })
  requirements: string[];

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  location: string;

  @DatabaseProp({
    required: true,
    trim: true,
  })
  salaryRange: string;

  @DatabaseProp({
    required: true,
    type: Date,
  })
  applicationDeadline: Date;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  category: string;

  @DatabaseProp({
    required: true,
    default: ENUM_HIRING_TYPE.FULL_TIME,
    index: true,
    type: String,
    enum: ENUM_HIRING_TYPE,
  })
  jobType: ENUM_HIRING_TYPE;

  @DatabaseProp({
    required: true,
    default: ENUM_HIRING_STATUS.DRAFT,
    index: true,
    type: String,
    enum: ENUM_HIRING_STATUS,
  })
  status: ENUM_HIRING_STATUS;
}

export const HiringSchema = DatabaseSchema(HiringEntity);

export type HiringDoc = IDatabaseDocument<HiringEntity>;
