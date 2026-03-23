import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';

export const CARE_RECORD_DEFAULT_AVAILABLE_SEARCH = [];
export const CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY = [
  'receivedAt',
  'handoverTime',
  'createdAt',
];

export const CARE_RECORD_DEFAULT_STATUS = Object.values(
  EnumCareRecordStatus,
);

export const CARE_RECORD_DEFAULT_PAYMENT_STATUS =
  Object.values(EnumPaymentStatus);

export const VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY = [
  'orderBy',
  'createdAt',
  'updatedAt',
];
