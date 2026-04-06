import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';

export const VehicleBrandDefaultAvailableSearch = ['name'];
export const VehicleBrandDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const VehicleBrandDefaultStatus = Object.values(EnumVehicleBrandStatus);
