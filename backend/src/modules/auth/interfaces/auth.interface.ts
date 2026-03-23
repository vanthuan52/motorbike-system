import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import { EnumAuthTwoFactorMethod } from '../enums/auth.enum';

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
  roleId: string;

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
  'type' | 'roleId' | 'username' | 'email' | 'verification'
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

export interface IAuthTwoFactorBackupCodes {
  codes: string[];
  hashes: string[];
}

export interface IAuthTwoFactorBackupCodesVerifyResult {
  isValid: boolean;
  index: number;
}

export interface IAuthTwoFactorChallenge {
  challengeToken: string;
  expiresInMs: number;
}

export interface IAuthTwoFactorChallengeCache {
  userId: string;
  device: DeviceRequestDto;
  loginFrom: EnumUserLoginFrom;
  loginWith: EnumUserLoginWith;
}

export interface IAuthTwoFactorVerify {
  method: EnumAuthTwoFactorMethod;
  code?: string;
  backupCode?: string;
}

export interface IAuthTwoFactorVerifyResult {
  isValid: boolean;
  method: EnumAuthTwoFactorMethod;
  newBackupCodes?: string[];
}

export interface IAuthTwoFactorSetup {
  secret: string;
  otpauthUrl: string;
  encryptedSecret: string;
  iv: string;
}
