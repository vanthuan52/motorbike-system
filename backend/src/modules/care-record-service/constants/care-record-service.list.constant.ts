import { EnumCareRecordServiceStatus } from '../enums/care-record-service.enum';

export const CareRecordServiceDefaultAvailableSearch = ['name'];
export const CareRecordServiceDefaultAvailableOrderBy = ['createdAt'];

export const CareRecordServiceDefaultStatus = Object.values(
  EnumCareRecordServiceStatus
);
