import { EnumActivityLogAction } from '../enums/activity-log.enum';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

/**
 * Domain model representing an activity log entry.
 * Maps from Prisma ActivityLog to application domain layer.
 */
export class ActivityLogModel {
  id: string;
  action: EnumActivityLogAction;
  ipAddress: string;
  userAgent?: UserAgent;
  geoLocation?: GeoLocation;
  metadata?: Record<string, unknown>;

  userId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<ActivityLogModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
