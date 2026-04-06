import { EnumVehicleServiceStatus } from '../enums/vehicle-service.enum';

export const VehicleServiceDefaultAvailableSearch = ['name'];
export const VehicleServiceDefaultAvailableOrderBy = [
  'order',
  'createdAt',
  'updatedAt',
];
export const VehicleServiceDefaultStatus = Object.values(
  EnumVehicleServiceStatus
);
