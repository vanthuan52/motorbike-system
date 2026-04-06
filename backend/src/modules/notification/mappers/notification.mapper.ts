import {
  NotificationDeliveryModel,
  NotificationModel,
  NotificationUserSettingModel,
} from '../models/notification.model';
import {
  EnumNotificationChannel,
  EnumNotificationPriority,
  EnumNotificationType,
} from '../enums/notification.enum';
import {
  Notification as PrismaNotification,
  NotificationDelivery as PrismaNotificationDelivery,
  NotificationUserSetting as PrismaNotificationUserSetting,
} from '@/generated/prisma-client';

export class NotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): NotificationModel {
    return new NotificationModel({
      id: prismaNotification.id,
      type: prismaNotification.type as unknown as EnumNotificationType,
      title: prismaNotification.title,
      body: prismaNotification.body,
      userId: prismaNotification.userId,
      metadata: prismaNotification.metadata as Record<string, any> | undefined,
      isRead: prismaNotification.isRead,
      readAt: prismaNotification.readAt || undefined,
      priority:
        prismaNotification.priority as unknown as EnumNotificationPriority,

      createdAt: prismaNotification.createdAt,
      updatedAt: prismaNotification.updatedAt,
      createdBy: prismaNotification.createdBy || undefined,
      updatedBy: prismaNotification.updatedBy || undefined,
    });
  }
}

export class NotificationUserSettingMapper {
  static toDomain(
    prismaUserSetting: PrismaNotificationUserSetting
  ): NotificationUserSettingModel {
    return new NotificationUserSettingModel({
      id: prismaUserSetting.id,
      type: prismaUserSetting.type as unknown as EnumNotificationType,
      channel: prismaUserSetting.channel as unknown as EnumNotificationChannel,
      isActive: prismaUserSetting.isActive,
      userId: prismaUserSetting.userId,

      createdAt: prismaUserSetting.createdAt,
      updatedAt: prismaUserSetting.updatedAt,
      createdBy: prismaUserSetting.createdBy || undefined,
      updatedBy: prismaUserSetting.updatedBy || undefined,
    });
  }
}

export class NotificationDeliveryMapper {
  static toDomain(
    prismaDelivery: PrismaNotificationDelivery
  ): NotificationDeliveryModel {
    return new NotificationDeliveryModel({
      id: prismaDelivery.id,
      notificationId: prismaDelivery.notificationId,
      channel: prismaDelivery.channel as unknown as EnumNotificationChannel,
      sentAt: prismaDelivery.sentAt || undefined,
      processedAt: prismaDelivery.processedAt || undefined,
      failureTokens: prismaDelivery.failureTokens,

      createdAt: prismaDelivery.createdAt,
      updatedAt: prismaDelivery.updatedAt,
    });
  }
}
