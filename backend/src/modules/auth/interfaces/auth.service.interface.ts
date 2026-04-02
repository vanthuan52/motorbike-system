import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import {
  IAuthJwtAccessTokenPayload,
  IAuthJwtRefreshTokenPayload,
  IAuthSocialPayload,
  IAuthAccessTokenGenerate,
} from '@/modules/auth/interfaces/auth.interface';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { AuthLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { AuthSignUpRequestDto } from '../dtos/request/auth.sign-up.request.dto';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { AuthForgotPasswordRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password.request.dto';
import { AuthForgotPasswordResetRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password-reset.request.dto';
import { IUser } from '@/modules/user/interfaces/user.interface';
import { AuthLoginResponseDto } from '../dtos/response/auth.login.response.dto';

export interface IAuthService {
  // Pure service
  validateJwtAccessStrategy(
    payload: IAuthJwtAccessTokenPayload
  ): Promise<IAuthJwtAccessTokenPayload>;
  validateJwtAccessGuard(
    err: Error,
    user: IAuthJwtAccessTokenPayload,
    info: Error
  ): Promise<IAuthJwtAccessTokenPayload>;
  validateJwtRefreshStrategy(
    payload: IAuthJwtRefreshTokenPayload
  ): Promise<IAuthJwtRefreshTokenPayload>;
  validateJwtRefreshGuard(
    err: Error,
    user: IAuthJwtRefreshTokenPayload,
    info: Error
  ): Promise<IAuthJwtRefreshTokenPayload>;
  validateOAuthAppleGuard(
    request: IRequestApp<IAuthSocialPayload>
  ): Promise<boolean>;
  validateOAuthGoogleGuard(
    request: IRequestApp<IAuthSocialPayload>
  ): Promise<boolean>;
  // API service
  loginCredential(
    data: AuthLoginRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthLoginResponseDto>;
  loginWithSocial(
    email: string,
    loginWith: EnumUserLoginWith,
    socialData: AuthCreateSocialRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthLoginResponseDto>;
  refreshToken(
    user: IUser,
    refreshToken: string,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto>;
  signUp(data: AuthSignUpRequestDto, requestLog: IRequestLog): Promise<void>;
  changePassword(
    user: IUser,
    data: AuthChangePasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  forgotPassword(
    data: AuthForgotPasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  resetPassword(
    data: AuthForgotPasswordResetRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  logout(
    userId: string,
    sessionId: string,
    requestLog: IRequestLog
  ): Promise<void>;
}

