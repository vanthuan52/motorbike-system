import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';

export interface IAuthPassword {
  passwordHash: string;
  passwordExpired?: Date;
  passwordCreated?: Date;
  passwordEncrypted?: string;
  passwordPeriodExpired?: Date;
}

export interface IAuthPasswordOptions {
  temporary: boolean;
}

export interface IAuthJwtAccessTokenPayload {
  loginAt: Date;
  loginFrom: EnumUserLoginFrom;
  loginWith: EnumUserLoginWith;
  email: string;
  username?: string;
  userId: string;
  sessionId: string;
  deviceOwnershipId: string;
  roles: string[];

  // standard JWT claims
  jti?: string;
  iat?: number;
  nbf?: number;
  exp?: number;
  aud?: string;
  iss?: string;
  sub?: string;
}

export type IAuthJwtRefreshTokenPayload = Omit<
  IAuthJwtAccessTokenPayload,
  'type' | 'roles' | 'username' | 'email' | 'verification'
>;

export interface IAuthSocialPayload extends Pick<
  IAuthJwtAccessTokenPayload,
  'email'
> {
  emailVerified: boolean;
}

export interface IAuthAccessTokenGenerate {
  tokens: AuthTokenResponseDto;
  jti: string;
  sessionId: string;
}

export interface IAuthRefreshTokenGenerate extends IAuthAccessTokenGenerate {
  expiredInMs: number;
}
