import { EnumFileExtension } from '@/common/file/enums/file.enum';
import { EnumCareRecordMediaStage } from '../enums/care-record-media.enum';

export const CareRecordMediaDefaultAvailableSearch: string[] = [];
export const CareRecordMediaDefaultAvailableOrderBy = ['createdAt'];

export const CareRecordMediaDefaultStage = Object.values(
  EnumCareRecordMediaStage,
);

export const CareRecordMediaDefaultType = Object.values(EnumFileExtension);

