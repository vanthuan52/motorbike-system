import { ENUM_FILE_MIME } from '@/common/file/enums/file.enum';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../enums/care-record-media.enum';

export const CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_SEARCH = [];
export const CARE_RECORD_MEDIA_DEFAULT_AVAILABLE_ORDER_BY = ['createdAt'];

export const CARE_RECORD_MEDIA_DEFAULT_STAGE = Object.values(
  ENUM_CARE_RECORD_MEDIA_STAGE,
);

export const CARE_RECORD_MEDIA__DEFAULT_TYPE = Object.values(ENUM_FILE_MIME);
