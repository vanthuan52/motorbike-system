import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';

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
  orderBy?: string;

  @DatabaseProp({
    required: false,
    maxLengt: 100,
  })
  country?: string;

  @DatabaseProp({
    required: true,
    default: EnumVehicleBrandStatus.active,
    index: true,
    type: String,
    enum: EnumVehicleBrandStatus,
  })
  status: EnumVehicleBrandStatus;

  @DatabaseProp({
    required: false,
    schema: AwsS3Dto,
  })
  photo?: AwsS3Dto;
}

export const VehicleBrandSchema = DatabaseSchema(VehicleBrandEntity);

export type VehicleBrandDoc = IDatabaseDocument<VehicleBrandEntity>;
