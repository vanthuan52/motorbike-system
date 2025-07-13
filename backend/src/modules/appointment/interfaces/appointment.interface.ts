import {
  VehicleServiceDoc,
  VehicleServiceEntity,
} from '@/modules/vehicle-service/entities/vehicle-service.entity';
import {
  AppointmentDoc,
  AppointmentEntity,
} from './../entities/appointment.entity';
import {
  VehicleModelDoc,
  VehicleModelEntity,
} from '@/modules/vehicle-model/entities/vehicle-model.entity';

export interface IAppointmentEntity
  extends Omit<AppointmentEntity, 'vehicleServices' | 'vehicleModel'> {
  vehicleServices: VehicleServiceEntity[];
  vehicleModel: VehicleModelEntity;
}

export interface IAppointmentDoc
  extends Omit<AppointmentDoc, 'vehicleServices' | 'vehicleModel'> {
  vehicleServices: VehicleServiceDoc;
  vehicleModel: VehicleModelDoc;
}
