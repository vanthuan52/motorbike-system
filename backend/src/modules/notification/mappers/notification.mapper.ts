import { NotificationModel } from '../models/notification.model';
import { EnumNotificationType, EnumNotificationPriority } from '@/generated/prisma-client';

export class NotificationMapper {
  static toDomain(prismaNotification: any): NotificationModel {
    const model = new NotificationModel();
    model.id = prismaNotification.id;
    model.type = prismaNotification.type as EnumNotificationType;
    model.title = prismaNotification.title;
    model.body = prismaNotification.body;
    model.userId = prismaNotification.userId;
    model.metadata = prismaNotification.metadata;
    model.isRead = prismaNotification.isRead;
    model.readAt = prismaNotification.readAt;
    model.priority = prismaNotification.priority as EnumNotificationPriority;

    model.createdAt = prismaNotification.createdAt;
    model.updatedAt = prismaNotification.updatedAt;
    model.deletedAt = prismaNotification.deletedAt;
    model.createdBy = prismaNotification.createdBy;
    model.updatedBy = prismaNotification.updatedBy;
    model.deletedBy = prismaNotification.deletedBy;

    return model;
  }
}
