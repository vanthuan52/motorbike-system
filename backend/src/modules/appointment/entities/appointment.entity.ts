import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { UserVehicleEntity } from '@/modules/user-vehicle/entities/user-vehicle.entity';

export const AppointmentTableName = 'appointments';

@DatabaseEntity({ collection: AppointmentTableName })
export class AppointmentEntity extends DatabaseEntityBase {
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
  })
  userVehicle?: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleModelEntity.name,
    index: true,
  })
  vehicleModel: string;

  @DatabaseProp({
    required: false,
    ref: () => VehicleServiceEntity.name,
    type: [String],
    default: [],
  })
  vehicleServices: string[];

  @DatabaseProp({
    required: false,
    maxlength: 20,
  })
  licensePlateNumber?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 255,
  })
  address?: string;

  @DatabaseProp({
    required: false,
    type: [String],
  })
  customerRequests?: string[];

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 500,
  })
  note?: string;

  @DatabaseProp({
    required: true,
  })
  appointmentDate: Date;

  @DatabaseProp({
    required: true,
    default: ENUM_APPOINTMENT_STATUS.PENDING,
    index: true,
    type: String,
    enum: ENUM_APPOINTMENT_STATUS,
  })
  status: ENUM_APPOINTMENT_STATUS;
}

export const AppointmentSchema = DatabaseSchema(AppointmentEntity);

export type AppointmentDoc = IDatabaseDocument<AppointmentEntity>;
