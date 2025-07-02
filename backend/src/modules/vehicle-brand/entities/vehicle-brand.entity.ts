import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { AwsS3Entity, AwsS3Schema } from '@/modules/aws/entities/aws.s3.entity';

export const VehicleBrandTableName = 'vehicle_brands';

@DatabaseEntity({ collection: VehicleBrandTableName })
export class VehicleBrandEntity extends DatabaseEntityBase {
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
    required: false,
    default: '0',
  })
  order?: string;

  @DatabaseProp({
    required: false,
    maxLengt: 100,
  })
  country?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_VEHICLE_BRAND_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_VEHICLE_BRAND_STATUS,
  })
  status: ENUM_VEHICLE_BRAND_STATUS;

  @DatabaseProp({
    required: false,
    schema: AwsS3Schema,
  })
  photo?: AwsS3Entity;
}

export const VehicleBrandSchema = DatabaseSchema(VehicleBrandEntity);

export type VehicleBrandDoc = IDatabaseDocument<VehicleBrandEntity>;
