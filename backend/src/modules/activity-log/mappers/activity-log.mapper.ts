import { ActivityLogModel } from '../models/activity-log.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { ActivityLog as PrismaActivityLog } from '@/generated/prisma-client';

export class ActivityLogMapper {
  static toDomain(prismaLog: PrismaActivityLog): ActivityLogModel {
    const model = new ActivityLogModel();
    model.id = prismaLog.id;
    model.action = prismaLog.action as EnumActivityLogAction;
    model.ipAddress = prismaLog.ipAddress;
    model.userAgent = prismaLog.userAgent;
    model.geoLocation = prismaLog.geoLocation;
    model.metadata = prismaLog.metadata;
    model.userId = prismaLog.userId;

    model.createdAt = prismaLog.createdAt;
    model.updatedAt = prismaLog.updatedAt;
    model.deletedAt = prismaLog.deletedAt;
    model.createdBy = prismaLog.createdBy;
    model.updatedBy = prismaLog.updatedBy;
    model.deletedBy = prismaLog.deletedBy;

    if (prismaLog.user) {
      model.user = UserMapper.toDomain(prismaLog.user);
    }

    return model;
  }
}
