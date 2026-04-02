import { UserModel } from '@/modules/user/models/user.model';
import { SessionModel } from '../models/session.model';

export interface ISession extends SessionModel {
  user: UserModel;
}

export interface ISessionCache {
  userId: string;
  sessionId: string;
  expiredAt: Date;
  jti: string;
}

export interface ISessionLoginCreate {
  sessionId: string;
  jti: string;
  expiredAt: Date;
  deviceOwnershipId: string;
}
