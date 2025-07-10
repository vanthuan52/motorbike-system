import {
  MaintenanceScheduleDoc,
  MaintenanceScheduleEntity,
} from './../entities/maintenance-schedule.entity';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '@/modules/service-category/entities/service-category.entity';

export interface IMaintenanceScheduleEntity
  extends Omit<MaintenanceScheduleEntity, 'serviceCategory'> {
  serviceCategory: ServiceCategoryEntity;
}

export interface IMaintenanceScheduleDoc
  extends Omit<MaintenanceScheduleDoc, 'serviceCategory'> {
  serviceCategory: ServiceCategoryDoc;
}
