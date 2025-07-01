import {
  VehicleServiceDoc,
  VehicleServiceEntity,
} from '../entities/vehicle-service.entity';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '@/modules/service-category/entities/service-category.entity';

export interface IVehicleServiceEntity
  extends Omit<VehicleServiceEntity, 'serviceCategory'> {
  serviceCategory: ServiceCategoryEntity;
}

export interface IVehicleServiceDoc
  extends Omit<VehicleServiceDoc, 'serviceCategory'> {
  serviceCategory: ServiceCategoryDoc;
}
