import { Request } from 'express';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IPaginationQuery } from '@/common/pagination/interfaces/pagination.interface';
import { RoleAbilityDto } from '@/modules/role/dtos/role.ability.dto';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { IApiKeyEntity } from '@/modules/api-key/interfaces/api-key.interface';

export interface IRequestApp<T = IAuthJwtAccessTokenPayload> extends Request {
  correlationId: string;
  user?: T;

  __apiKey?: IApiKeyEntity;
  __user?: IUserDoc;
  __abilities?: RoleAbilityDto[];

  __pagination?: IPaginationQuery;

  __language: string;
  __version: string;
}

export interface IRequestLog {
  userAgent: RequestUserAgentDto;
  ipAddress: string;
}
