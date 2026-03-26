import {
  EnumNotificationChannel,
  EnumNotificationType,
} from '../enums/notification.enum';

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
}

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
}
