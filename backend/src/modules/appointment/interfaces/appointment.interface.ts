import {
  AppointmentsDoc,
  AppointmentsEntity,
} from './../entities/appointment.entity';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '@/modules/service-category/entities/service-category.entity';

export interface IAppointmentsEntity
  extends Omit<AppointmentsEntity, 'vehicleServices'> {
  vehicleServices: ServiceCategoryEntity;
}

export interface IAppointmentsDoc
  extends Omit<AppointmentsDoc, 'vehicleServices'> {
  vehicleServices: ServiceCategoryDoc;
}
