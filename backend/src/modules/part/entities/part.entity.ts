import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_PART_STATUS } from '../enums/part.enum';
import { PartTypeEntity } from '@/modules/part-type/entities/part-type.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';

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
    default: EnumPartStatus.active,
    index: true,
    type: String,
    enum: EnumPartStatus,
  })
  status: EnumPartStatus;

  @DatabaseProp({
    required: false,
    default: '0',
  })
  orderBy?: string;

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
}

export const PartSchema = DatabaseSchema(PartEntity);

export type PartDoc = IDatabaseDocument<PartEntity>;
