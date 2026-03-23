import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';

export const VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const VEHICLE_BRAND_DEFAULT_STATUS = Object.values(
  EnumVehicleBrandStatus,
);
