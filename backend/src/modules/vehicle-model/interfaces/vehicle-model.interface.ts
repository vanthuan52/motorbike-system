import {
  VehicleBrandEntity,
  VehicleBrandDoc,
} from '@/modules/vehicle-brand/entities/vehicle-brand.entity';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '../entities/vehicle-model.entity';

export interface IVehicleModelEntity
  extends Omit<VehicleModelEntity, 'vehicleBrand'> {
  vehicleBrand: VehicleBrandEntity;
}

export interface IVehicleModelDoc
  extends Omit<VehicleModelDoc, 'vehicleBrand'> {
  vehicleBrand: VehicleBrandDoc;
}
