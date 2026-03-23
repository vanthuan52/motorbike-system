import { EnumSessionStatus } from '../enums/session.enum';

export class SessionModel {
  id: string;
  jti?: string;
  ip: string;
  userAgent?: any;
  expiredAt: Date;
  revokeAt?: Date;
  status: EnumSessionStatus;
  hostname?: string;
  protocol?: string;
  originalUrl?: string;
  method?: string;
  xForwardedFor?: string;
  xForwardedHost?: string;
  xForwardedPorto?: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
