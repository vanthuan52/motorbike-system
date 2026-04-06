import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../enums/vehicle-model.enum';

export const VehicleModelDefaultAvailableSearch = ['name'];
export const VehicleModelDefaultAvailableOrderBy = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const VehicleModelDefaultStatus = Object.values(EnumVehicleModelStatus);
export const VehicleModelDefaultType = Object.values(EnumVehicleModelType);

export const VehicleModelDefaultFuelType = Object.values(
  EnumVehicleModelFuelType
);
