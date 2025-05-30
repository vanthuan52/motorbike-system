import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import {
  IAuthJwtAccessTokenPayload,
  IAuthJwtRefreshTokenPayload,
  IAuthPassword,
  IAuthPasswordOptions,
} from './auth.interface';
import { ENUM_AUTH_LOGIN_FROM } from '../enums/auth.enum';

export interface IAuthService {
  createAccessToken(
    subject: string,
    payload: IAuthJwtAccessTokenPayload,
  ): string;
  validateAccessToken(subject: string, token: string): boolean;
  payload<T = any>(token: string): T;
  createRefreshToken(
    subject: string,
    payload: IAuthJwtRefreshTokenPayload,
  ): string;
  validateRefreshToken(subject: string, token: string): boolean;
  validateUser(passwordString: string, passwordHash: string): boolean;
  createPayloadAccessToken(
    data: IUserDoc,
    session: string,
    loginDate: Date,
    loginFrom: ENUM_AUTH_LOGIN_FROM,
  ): IAuthJwtAccessTokenPayload;
  createPayloadRefreshToken({
    user,
    session,
    loginFrom,
    loginDate,
  }: IAuthJwtAccessTokenPayload): IAuthJwtRefreshTokenPayload;
  createSalt(length: number): string;
  createPassword(
    password: string,
    options?: IAuthPasswordOptions,
  ): IAuthPassword;
  createPasswordRandom(): string;
  checkPasswordExpired(passwordExpired: Date): boolean;
  createToken(user: IUserDoc, session: string): any; // AuthLoginResponseDto
  refreshToken(user: IUserDoc, refreshTokenFromRequest: string): any;
  getPasswordAttempt(): boolean;
  getPasswordMaxAttempt(): number;
  //appleGetTokenInfo(idToken: string): Promise<IAuthSocialApplePayload>;
  //googleGetTokenInfo(idToken: string): Promise<IAuthSocialGooglePayload>;
}
