import { EnumActivityLogAction } from '../enums/activity-log.enum';

export class ActivityLogModel {
  id: string;
  action: EnumActivityLogAction;
  ipAddress: string;
  userAgent?: any;
  metadata?: any;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
