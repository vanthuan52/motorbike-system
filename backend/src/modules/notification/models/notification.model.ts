import {
  EnumNotificationChannel,
  EnumNotificationPriority,
  EnumNotificationType,
} from '../enums/notification.enum';

/**
 * Domain model representing a notification sent to a user.
 * Maps from Prisma Notification to application domain layer.
 */
export class NotificationModel {
  id: string;
  type: EnumNotificationType;
  title: string;
  body: string;
  userId: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  priority: EnumNotificationPriority;

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
 * Maps from Prisma NotificationUserSetting to application domain layer.
 */
export class NotificationUserSettingModel {
  id: string;
  type: EnumNotificationType;
  channel: EnumNotificationChannel;
  isActive: boolean;

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

/**
 * Domain model representing the delivery status of a notification across a specific channel.
 * Maps from Prisma NotificationDelivery to application domain layer.
 */
export class NotificationDeliveryModel {
  id: string;
  notificationId: string;
  channel: EnumNotificationChannel;
  sentAt?: Date;
  processedAt?: Date;
  failureTokens: string[];

  notification?: NotificationModel;

  createdAt: Date;
  updatedAt: Date;

  constructor(data?: Partial<NotificationDeliveryModel>) {
    Object.assign(this, data);
  }
}
