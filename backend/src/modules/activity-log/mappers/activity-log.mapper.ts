import { ActivityLogModel } from '../models/activity-log.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { ActivityLog as PrismaActivityLog } from '@/generated/prisma-client';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

export class ActivityLogMapper {
  static toDomain(prismaLog: PrismaActivityLog | any): ActivityLogModel {
    const model = new ActivityLogModel();
    model.id = prismaLog.id;
    model.action = prismaLog.action as EnumActivityLogAction;
    model.ipAddress = prismaLog.ipAddress;
    model.userAgent = prismaLog.userAgent as UserAgent;
    model.geoLocation = prismaLog.geoLocation as GeoLocation;
    model.metadata = prismaLog.metadata as any;
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
