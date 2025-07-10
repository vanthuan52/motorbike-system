import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../enums/maintenance-schedule.enum';
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

export const MaintenanceScheduleTableName = 'maintenance_schedules';

@DatabaseEntity({ collection: MaintenanceScheduleTableName })
export class MaintenanceScheduleEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  customer: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  phone: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleBrandEntity.name,
    index: true,
    trim: true,
    maxlength: 255,
  })
  vehicleBrand: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleModelEntity.name,
    trim: true,
    maxlength: 255,
  })
  vehicleModel: string;

  @DatabaseProp({
    required: false,
    ref: () => UserEntity.name,
    trim: true,
    maxlength: 255,
  })
  staff?: string;

  @DatabaseProp({
    required: true,
    ref: () => ServiceCategoryEntity.name,
    index: true,
    trim: true,
    type: [String],
  })
  serviceCategory: string[];

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 255,
  })
  vehicleNumber: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 255,
  })
  scheduleDate: Date;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 255,
  })
  timeSlot: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 255,
  })
  address: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 500,
  })
  note: string;
  @DatabaseProp({
    required: true,
    default: ENUM_MAINTENANCE_SCHEDULE_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_MAINTENANCE_SCHEDULE_STATUS,
  })
  status: ENUM_MAINTENANCE_SCHEDULE_STATUS;
}

export const MaintenanceScheduleSchema = DatabaseSchema(
  MaintenanceScheduleEntity,
);

export type MaintenanceScheduleDoc =
  IDatabaseDocument<MaintenanceScheduleEntity>;
