import { ENUM_CARE_RECORD_SERVICE_STATUS } from '../enums/care-record-service.enum';

export const CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH = ['name'];
export const CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt'];

export const CARE_RECORD_SERVICE_DEFAULT_STATUS = Object.values(
  ENUM_CARE_RECORD_SERVICE_STATUS,
);
