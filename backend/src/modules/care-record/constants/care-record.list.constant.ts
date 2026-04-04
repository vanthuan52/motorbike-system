import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';

export const CareRecordDefaultAvailableSearch: string[] = [];
export const CareRecordDefaultAvailableOrderBy = [
  'receivedAt',
  'handoverTime',
  'createdAt',
];

export const CareRecordDefaultStatus = Object.values(
  EnumCareRecordStatus,
);

export const CareRecordDefaultPaymentStatus =
  Object.values(EnumPaymentStatus);

