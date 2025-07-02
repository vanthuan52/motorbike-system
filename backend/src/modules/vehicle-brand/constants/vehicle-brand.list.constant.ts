import { ENUM_VEHICLE_BRAND_STATUS } from '../enums/vehicle-brand.enum';

export const VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const VEHICLE_BRAND_DEFAULT_STATUS = Object.values(
  ENUM_VEHICLE_BRAND_STATUS,
);
