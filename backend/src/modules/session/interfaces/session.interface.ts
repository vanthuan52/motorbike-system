import { SessionDoc, SessionEntity } from '../entities/session.entity';

export interface ISessionEntity extends SessionEntity {}

export interface ISessionDoc extends SessionDoc {}

export interface ISessionCache {
  userId: string;
  sessionId: string;
  expiredAt: Date;
  jti: string;
}
