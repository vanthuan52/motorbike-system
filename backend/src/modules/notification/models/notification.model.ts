import {
  EnumNotificationChannel,
  EnumNotificationType,
} from '../enums/notification.enum';

/**
 * Domain model representing a notification sent to a user.
 * Maps from Prisma Notification to application domain layer.
 */
export class NotificationModel {
  id: string;
  type: EnumNotificationType;
  channel: EnumNotificationChannel;
  title: string;
  content: string;
  isRead: boolean;

  userId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<NotificationModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}

/**
 * Domain model representing a user's notification preference settings.
 * Maps from Prisma NotificationSetting to application domain layer.
 */
export class NotificationUserSettingModel {
  id: string;
  type: EnumNotificationType;
  channel: EnumNotificationChannel;
  isEnabled: boolean;

  userId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<NotificationUserSettingModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
