import { EnumUserVehicleStatus } from '../enums/user-vehicle.enum';

export const UserVehicleDefaultAvailableSearch = ['name'];
export const UserVehicleDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const UserVehicleDefaultStatus = Object.values(EnumUserVehicleStatus);
