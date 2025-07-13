import { ENUM_USER_VEHICLE_STATUS } from '../enums/user-vehicle.enum';

export const USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const USER_VEHICLE_DEFAULT_STATUS = Object.values(
  ENUM_USER_VEHICLE_STATUS,
);
