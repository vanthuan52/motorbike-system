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
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

export const PartTableName = 'parts';

@DatabaseEntity({ collection: PartTableName })
export class PartEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 150,
  })
  name: string;

  @DatabaseProp({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 200,
  })
  slug: string;

  @DatabaseProp({
    required: false,
    maxlength: 500,
    default: null,
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
    default: '0',
  })
  order?: string;

  @DatabaseProp({
    required: true,
    ref: () => PartTypeEntity.name,
    index: true,
  })
  partType: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleBrandEntity.name,
    index: true,
  })
  vehicleBrand: string;

  @DatabaseProp({
    required: false,
    schema: AwsS3Schema,
  })
  photo?: AwsS3Entity;
}

export const PartSchema = DatabaseSchema(PartEntity);

export type PartDoc = IDatabaseDocument<PartEntity>;
