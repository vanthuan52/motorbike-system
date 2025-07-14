import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { VehicleModelEntity } from '@/modules/vehicle-model/entities/vehicle-model.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { StoreEntity } from '@/modules/store/entities/store.entity';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';
import { AppointmentEntity } from '@/modules/appointment/entities/appointment.entity';
import { UserVehicleEntity } from '@/modules/user-vehicle/entities/user-vehicle.entity';

export const CareRecordTableName = 'care_records';

@DatabaseEntity({
  collection: CareRecordTableName,
})
export class CareRecordEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: false,
    ref: () => AppointmentEntity.name,
  })
  appointment: string;

  @DatabaseProp({
    required: true,
    ref: () => UserVehicleEntity.name,
  })
  userVehicle: string;

  @DatabaseProp({
    required: false,
    ref: () => UserEntity.name,
  })
  technician?: string;

  @DatabaseProp({
    required: false,
    ref: () => StoreEntity.name,
  })
  store?: string;

  @DatabaseProp({
    required: true,
    default: () => new Date(),
  })
  receivedAt: Date;

  @DatabaseProp({
    required: true,
    default: false,
  })
  confirmedByOwner: boolean;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_STATUS.PENDING,
    type: String,
    enum: ENUM_CARE_RECORD_STATUS,
  })
  status: ENUM_CARE_RECORD_STATUS;

  @DatabaseProp({
    required: false,
    default: () => new Date(),
  })
  handoverTime: Date;

  @DatabaseProp({
    required: true,
    default: ENUM_PAYMENT_STATUS.UNPAID,
    type: String,
    enum: ENUM_PAYMENT_STATUS,
  })
  paymentStatus: ENUM_PAYMENT_STATUS;

  @DatabaseProp({
    required: false,
    default: 0,
  })
  totalCost: number;
}

export const CareRecordSchema = DatabaseSchema(CareRecordEntity);

export type CareRecordDoc = IDatabaseDocument<CareRecordEntity>;
