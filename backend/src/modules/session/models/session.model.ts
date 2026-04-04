import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { UserModel } from '@/modules/user/models/user.model';

/**
 * Domain model representing a user session.
 * Maps from Prisma Session to application domain layer.
 */
export class SessionModel {
  id: string;
  userId: string;
  deviceOwnershipId: string;
  jti: string;
  ipAddress: string;
  userAgent: UserAgent;
  geoLocation?: GeoLocation;
  expiredAt: Date;
  revokedAt?: Date;
  isRevoked: boolean;
  revokedById?: string;

  user?: UserModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<SessionModel>) {
    Object.assign(this, data);
  }

  isExpired(): boolean {
    return this.expiredAt < new Date();
  }

  isActive(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
