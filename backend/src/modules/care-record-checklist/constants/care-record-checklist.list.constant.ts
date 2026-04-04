import {
  EnumCareRecordChecklistResult,
  EnumCareRecordChecklistStatus,
} from '../enums/care-record-checklist.enum';

export const CareRecordChecklistDefaultAvailableSearch = ['name'];
export const CareRecordChecklistDefaultAvailableOrderBy = ['createdAt'];

export const CareRecordChecklistDefaultStatus = Object.values(
  EnumCareRecordChecklistStatus,
);

export const CareRecordChecklistDefaultResult = Object.values(
  EnumCareRecordChecklistResult,
);

