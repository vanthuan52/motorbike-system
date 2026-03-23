import {
  EnumVehicleModelFuelType,
  EnumVehicleModelStatus,
  EnumVehicleModelType,
} from '../enums/vehicle-model.enum';

export const VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
export const VEHICLE_MODEL_DEFAULT_STATUS = Object.values(
  EnumVehicleModelStatus,
);
export const VEHICLE_MODEL_DEFAULT_TYPE = Object.values(
  EnumVehicleModelType,
);

export const VEHICLE_MODEL_DEFAULT_FUEL_TYPE = Object.values(
  EnumVehicleModelFuelType,
);
