import { SessionModel } from '../models/session.model';
import { EnumSessionStatus } from '../enums/session.enum';
import { UserMapper } from '@/modules/user/mappers/user.mapper';

export class SessionMapper {
  static toDomain(prismaSession: any): SessionModel {
    const model = new SessionModel();
    model.id = prismaSession.id;
    model.jti = prismaSession.jti;
    model.ip = prismaSession.ip;
    model.userAgent = prismaSession.userAgent;
    model.expiredAt = prismaSession.expiredAt;
    model.revokeAt = prismaSession.revokeAt;
    model.status = prismaSession.status as EnumSessionStatus;
    model.hostname = prismaSession.hostname;
    model.protocol = prismaSession.protocol;
    model.originalUrl = prismaSession.originalUrl;
    model.method = prismaSession.method;
    model.xForwardedFor = prismaSession.xForwardedFor;
    model.xForwardedHost = prismaSession.xForwardedHost;
    model.xForwardedPorto = prismaSession.xForwardedPorto;
    model.userId = prismaSession.userId;

    model.createdAt = prismaSession.createdAt;
    model.updatedAt = prismaSession.updatedAt;
    model.deletedAt = prismaSession.deletedAt;
    model.createdBy = prismaSession.createdBy;
    model.updatedBy = prismaSession.updatedBy;
    model.deletedBy = prismaSession.deletedBy;

    if (prismaSession.user) {
      model.user = UserMapper.toDomain(prismaSession.user);
    }

    return model;
  }
}
