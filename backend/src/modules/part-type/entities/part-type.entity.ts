import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { EnumPartTypeStatus } from '../enums/part-type.enum';
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
    maxlength: 150,
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
    required: false,
    maxlength: 20,
    trim: true,
  })
  order?: string;

  @DatabaseProp({
    required: true,
    default: EnumPartTypeStatus.active,
    index: true,
    type: String,
    enum: EnumPartTypeStatus,
  })
  status: EnumPartTypeStatus;

  @DatabaseProp({
    required: false,
    default: null,
  })
  photo?: string;
}

export const PartTypeSchema = DatabaseSchema(PartTypeEntity);

export type PartTypeDoc = IDatabaseDocument<PartTypeEntity>;
