import { EnumCareRecordMediaStage } from '../enums/care-record-media.enum';

/**
 * Domain model representing a media attachment for a care record.
 * Maps from Prisma CareRecordMedia to application domain layer.
 */
export class CareRecordMediaModel {
  id: string;
  url?: string;
  description?: string;
  stage: EnumCareRecordMediaStage;
  type: string;

  careRecordId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<CareRecordMediaModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
