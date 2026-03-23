import { EnumCareRecordMediaStage, EnumMediaFileType } from '../enums/care-record-media.enum';

export class CareRecordMediaModel {
  id: string;
  url?: string;
  description?: string;
  stage: EnumCareRecordMediaStage;
  type: EnumMediaFileType;
  careRecordId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
