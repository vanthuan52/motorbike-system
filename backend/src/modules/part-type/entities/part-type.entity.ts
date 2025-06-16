import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_PART_TYPE_STATUS } from '../enums/part-type.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const PartTypeTableName = 'part_types';

@DatabaseEntity({ collection: PartTypeTableName })
export class PartTypeEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @DatabaseProp({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  })
  slug: string;

  @DatabaseProp({
    required: false,
    maxlength: 255,
    default: null,
    trim: true,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_PART_TYPE_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_PART_TYPE_STATUS,
  })
  status: ENUM_PART_TYPE_STATUS;

  @DatabaseProp({
    required: false,
    default: null,
  })
  photo?: string;
}

export const PartTypeSchema = DatabaseSchema(PartTypeEntity);

export type PartTypeDoc = IDatabaseDocument<PartTypeEntity>;
