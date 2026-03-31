import { Request } from 'express';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IPaginationQuery } from '@/common/pagination/interfaces/pagination.interface';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { IApiKey } from '@/modules/api-key/interfaces/api-key.interface';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

export interface IRequestApp<T = IAuthJwtAccessTokenPayload> extends Request {
  correlationId: string;
  user?: T;

  __apiKey?: IApiKey;
  __user?: IUser;
  __abilities?: IPolicyAbility[];

  __pagination?: IPaginationQuery;

  __language: string;
  __version: string;
}

export interface IRequestLog {
  userAgent: UserAgent;
  ipAddress: string;
  geoLocation?: GeoLocation;
}
