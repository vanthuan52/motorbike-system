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
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { UserLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import { UserCreateSocialRequestDto } from '@/modules/user/dtos/request/user.create-social.request.dto';
import { AuthSignUpRequestDto } from '../dtos/request/auth.sign-up.request.dto';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { UserForgotPasswordRequestDto } from '@/modules/user/dtos/request/user.forgot-password.request.dto';
import { UserForgotPasswordResetRequestDto } from '@/modules/user/dtos/request/user.forgot-password-reset.request.dto';

export interface IAuthService {
  // Pure service
  createTokens(
    user: IUserDoc,
    loginFrom: EnumUserLoginFrom,
    loginWith: EnumUserLoginWith
  ): IAuthAccessTokenGenerate;
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
    data: UserLoginRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto>;
  loginWithSocial(
    email: string,
    loginWith: EnumUserLoginWith,
    socialData: UserCreateSocialRequestDto,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto>;
  refreshToken(
    user: IUserDoc,
    refreshToken: string,
    requestLog: IRequestLog
  ): Promise<AuthTokenResponseDto>;
  signUp(data: AuthSignUpRequestDto, requestLog: IRequestLog): Promise<void>;
  changePassword(
    user: IUserDoc,
    data: AuthChangePasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;

  forgotPassword(
    data: UserForgotPasswordRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  resetPassword(
    data: UserForgotPasswordResetRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
}
