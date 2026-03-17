import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { EnumSessionStatus } from '../enums/session.enum';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { SessionUserAgentEntity } from './session.user-agent.entity';

export const SessionTableName = 'sessions';

@DatabaseEntity({ collection: SessionTableName })
export class SessionEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    index: true,
    trim: true,
    type: String,
    ref: UserEntity.name,
  })
  user: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  jti?: string;

  @DatabaseProp({
    required: true,
    trim: true,
    type: String,
  })
  ip: string;

  @DatabaseProp({
    required: false,
    type: SessionUserAgentEntity,
    _id: false,
  })
  userAgent?: SessionUserAgentEntity;

  @DatabaseProp({
    required: true,
    type: Date,
  })
  expiredAt: Date;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  revokeAt?: Date;

  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: EnumSessionStatus,
    default: EnumSessionStatus.active,
  })
  status: EnumSessionStatus;

  // Optional
  @DatabaseProp({
    required: false,
    type: String,
  })
  hostname?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  protocol?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  originalUrl?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  method?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  xForwardedFor?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  xForwardedHost?: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
  })
  xForwardedPorto?: string;
}

export const SessionSchema = DatabaseSchema(SessionEntity);
export type SessionDoc = IDatabaseDocument<SessionEntity>;
