import { SessionModel } from '../models/session.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

export class SessionMapper {
  static toDomain(prismaSession: any): SessionModel {
    const model = new SessionModel();
    model.userId = prismaSession.userId;
    model.deviceOwnershipId = prismaSession.deviceOwnershipId;
    model.jti = prismaSession.jti;
    model.ipAddress = prismaSession.ipAddress;

    // Convert Json to Domain types
    model.userAgent = prismaSession.userAgent as UserAgent;
    model.geoLocation = prismaSession.geoLocation as GeoLocation | undefined;

    model.expiredAt = prismaSession.expiredAt;
    model.revokedAt = prismaSession.revokedAt;
    model.isRevoked = prismaSession.isRevoked;
    model.revokedById = prismaSession.revokedById;

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
