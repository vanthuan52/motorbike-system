import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { AwsS3Entity, AwsS3Schema } from '@/modules/aws/entities/aws.s3.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';

export const VehicleModelTableName = 'vehicle_models';

@DatabaseEntity({ collection: VehicleModelTableName })
export class VehicleModelEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 150,
  })
  name: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 200,
  })
  fullName: string;

  @DatabaseProp({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 250,
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
    default: ENUM_VEHICLE_MODEL_TYPE.UNKNOWN,
    index: true,
    type: String,
    enum: ENUM_VEHICLE_MODEL_TYPE,
  })
  type: ENUM_VEHICLE_MODEL_TYPE;

  @DatabaseProp({
    required: true,
    default: ENUM_VEHICLE_MODEL_FUEL_TYPE.UNKNOWN,
    index: true,
    type: String,
    enum: ENUM_VEHICLE_MODEL_FUEL_TYPE,
  })
  fuelType: ENUM_VEHICLE_MODEL_FUEL_TYPE;

  @DatabaseProp({
    required: true,
    default: ENUM_VEHICLE_MODEL_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_VEHICLE_MODEL_STATUS,
  })
  status: ENUM_VEHICLE_MODEL_STATUS;

  @DatabaseProp({
    required: false,
    default: '0',
  })
  order?: string;

  @DatabaseProp({
    required: false,
  })
  yearStart?: number;

  @DatabaseProp({
    required: false,
  })
  yearEnd?: number;

  @DatabaseProp({
    required: true,
    ref: () => VehicleBrandEntity.name,
    index: true,
    trim: true,
  })
  vehicleBrand: string;

  @DatabaseProp({
    required: false,
    schema: AwsS3Schema,
  })
  photo?: AwsS3Entity;
}

export const VehicleModelSchema = DatabaseSchema(VehicleModelEntity);

export type VehicleModelDoc = IDatabaseDocument<VehicleModelEntity>;
