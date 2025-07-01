import { ENUM_VEHICLE_SERVICE_STATUS } from '../enums/vehicle-service.enum';

export const VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const VEHICLE_SERVICE_DEFAULT_STATUS = Object.values(
  ENUM_VEHICLE_SERVICE_STATUS,
);
