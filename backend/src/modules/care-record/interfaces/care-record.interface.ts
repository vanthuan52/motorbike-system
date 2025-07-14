import {
  UserVehicleDoc,
  UserVehicleEntity,
} from '@/modules/user-vehicle/entities/user-vehicle.entity';
import {
  CareRecordDoc,
  CareRecordEntity,
} from '../entities/care-record.entity';

export interface ICareRecordEntity
  extends Omit<CareRecordEntity, 'userVehicle'> {
  userVehicle: UserVehicleEntity;
}

export interface ICareRecordDoc extends Omit<CareRecordDoc, 'userVehicle'> {
  userVehicle: UserVehicleDoc;
}
