import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import {
  VehicleBrandDoc,
  VehicleBrandEntity,
} from '../entities/vehicle-brand.entity';

export interface IVehicleBrandEntity
  extends Omit<VehicleBrandEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface IVehicleBrandDoc extends Omit<VehicleBrandDoc, 'createdBy'> {
  createdBy: UserDoc;
}
