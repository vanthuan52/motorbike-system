import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { AwsS3Entity, AwsS3Schema } from '@/modules/aws/entities/aws.s3.entity';
import { PartTypeEntity } from '@/modules/part-type/entities/part-type.entity';

export const PartTableName = 'parts';

@DatabaseEntity({ collection: PartTableName })
export class PartEntity extends DatabaseEntityBase {
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
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 50,
  })
  code: string;

  @DatabaseProp({
    type: String,
    ref: 'branches',
    required: true,
    index: true,
  })
  branch: string;

  @DatabaseProp({
    type: String,
    ref: () => PartTypeEntity.name,
    required: true,
    index: true,
  })
  type: string;

  @DatabaseProp({
    required: false,
    maxlength: 255,
    default: null,
    trim: true,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_PART_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_PART_STATUS,
  })
  status: ENUM_PART_STATUS;

  @DatabaseProp({
    required: false,
    schema: AwsS3Schema,
  })
  photo?: AwsS3Entity;
}

export const PartSchema = DatabaseSchema(PartEntity);

export type PartDoc = IDatabaseDocument<PartEntity>;
