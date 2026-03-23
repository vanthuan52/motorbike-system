import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../enums/vehicle-model.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
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
    required: false,
    trim: true,
    maxlength: 200,
  })
  fullName?: string;

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
    required: false,
  })
  engineDisplacement?: number;

  @DatabaseProp({
    required: false,
  })
  modelYear?: number;

  @DatabaseProp({
    required: true,
    default: EnumVehicleModelType.unknown,
    index: true,
    type: String,
    enum: EnumVehicleModelType,
  })
  type: EnumVehicleModelType;

  @DatabaseProp({
    required: true,
    default: EnumVehicleModelFuelType.unknown,
    index: true,
    type: String,
    enum: EnumVehicleModelFuelType,
  })
  fuelType: EnumVehicleModelFuelType;

  @DatabaseProp({
    required: true,
    default: EnumVehicleModelStatus.active,
    index: true,
    type: String,
    enum: EnumVehicleModelStatus,
  })
  status: EnumVehicleModelStatus;

  @DatabaseProp({
    required: false,
    default: '0',
  })
  orderBy?: string;

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
  })
  vehicleBrand: string;

  @DatabaseProp({
    required: false,
  })
  photo?: string;
}

export const VehicleModelSchema = DatabaseSchema(VehicleModelEntity);

export type VehicleModelDoc = IDatabaseDocument<VehicleModelEntity>;
