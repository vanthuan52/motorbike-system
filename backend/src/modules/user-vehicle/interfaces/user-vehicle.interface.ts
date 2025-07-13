import {
  UserVehicleDoc,
  UserVehicleEntity,
} from '../entities/user-vehicle.entity';
import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '@/modules/vehicle-model/entities/vehicle-model.entity';

export interface IUserVehicleEntity
  extends Omit<UserVehicleEntity, 'user' | 'vehicleModel'> {
  user: UserEntity;
  vehicleModel: VehicleModelEntity;
}

export interface IUserVehicleDoc
  extends Omit<UserVehicleDoc, 'user' | 'vehicleModel'> {
  user: UserDoc;
  vehicleModel: VehicleModelDoc;
}
