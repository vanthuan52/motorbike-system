import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';

export const CARE_RECORD_DEFAULT_AVAILABLE_SEARCH = [];
export const CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY = [
  'receivedAt',
  'handoverTime',
  'createdAt',
];

export const CARE_RECORD_DEFAULT_STATUS = Object.values(
  ENUM_CARE_RECORD_STATUS,
);

export const CARE_RECORD_DEFAULT_PAYMENT_STATUS =
  Object.values(ENUM_PAYMENT_STATUS);

export const VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY = [
  'order',
  'createdAt',
  'updatedAt',
];
