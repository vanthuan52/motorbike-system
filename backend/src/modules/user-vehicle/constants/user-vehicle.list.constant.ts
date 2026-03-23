import { EnumUserVehicleStatus } from '../enums/user-vehicle.enum';

export const USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const USER_VEHICLE_DEFAULT_STATUS = Object.values(
  EnumUserVehicleStatus,
);
