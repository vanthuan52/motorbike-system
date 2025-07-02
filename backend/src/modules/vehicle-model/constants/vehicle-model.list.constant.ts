import {
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
  ENUM_VEHICLE_MODEL_STATUS,
  ENUM_VEHICLE_MODEL_TYPE,
} from '../enums/vehicle-model.enum';

export const VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
export const VEHICLE_MODEL_DEFAULT_STATUS = Object.values(
  ENUM_VEHICLE_MODEL_STATUS,
);
export const VEHICLE_MODEL_DEFAULT_TYPE = Object.values(
  ENUM_VEHICLE_MODEL_TYPE,
);

export const VEHICLE_MODEL_DEFAULT_FUEL_TYPE = Object.values(
  ENUM_VEHICLE_MODEL_FUEL_TYPE,
);
