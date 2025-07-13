import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_APPOINTMENTS_STATUS } from '../enums/appointment.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { VehicleBrandEntity } from '@/modules/vehicle-brand/entities/vehicle-brand.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { UserVehicleEntity } from '@/modules/user-vehicle/entities/user-vehicle.entity';

export const AppointmentsTableName = 'appointments';

@DatabaseEntity({ collection: AppointmentsTableName })
export class AppointmentsEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: false,
    ref: () => UserEntity.name,
    index: true,
    maxlength: 255,
  })
  user?: string;

  @DatabaseProp({
    required: false,
    ref: () => UserVehicleEntity.name,
    index: true,
    maxlength: 255,
  })
  userVehicle?: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 200,
  })
  name: string;

  @DatabaseProp({
    required: true,
    trim: true,
    index: true,
    maxlength: 20,
  })
  phone: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleModelEntity.name,
    index: true,
    maxlength: 255,
  })
  vehicleModel: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleServiceEntity.name,
    index: true,
    trim: true,
    type: [String],
  })
  vehicleServices: string[];

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 20,
  })
  licensePlate: string;

  @DatabaseProp({
    required: true,
    trim: true,
  })
  appointmentDate: Date;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 255,
  })
  address?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 500,
  })
  note: string;

  @DatabaseProp({
    required: true,
    default: ENUM_APPOINTMENTS_STATUS.PENDING,
    index: true,
    type: String,
    enum: ENUM_APPOINTMENTS_STATUS,
  })
  status: ENUM_APPOINTMENTS_STATUS;
}

export const AppointmentsSchema = DatabaseSchema(AppointmentsEntity);

export type AppointmentsDoc = IDatabaseDocument<AppointmentsEntity>;
