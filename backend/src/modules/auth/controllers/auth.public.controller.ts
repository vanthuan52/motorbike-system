import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { AuthJwtPayload } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  AuthSocialAppleProtected,
  AuthSocialGoogleProtected,
} from '@/modules/auth/decorators/auth.social.decorator';
import { AuthTokenResponseDto } from '@/modules/auth/dtos/response/auth.token.response.dto';
import { IAuthSocialPayload } from '@/modules/auth/interfaces/auth.interface';
import {
  AuthPublicLoginSocialAppleDoc,
  AuthPublicLoginSocialGoogleDoc,
  AuthPublicForgotPasswordDoc,
  AuthPublicLoginCredentialDoc,
  AuthPublicResetPasswordDoc,
  AuthPublicSendEmailVerificationDoc,
  AuthPublicSignUpDoc,
  AuthPublicVerifyEmailDoc,
} from '@/modules/auth/docs/auth.public.doc';
import { UserCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { UserForgotPasswordResetRequestDto } from '@/modules/user/dtos/request/user.forgot-password-reset.request.dto';
import { UserForgotPasswordRequestDto } from '@/modules/user/dtos/request/user.forgot-password.request.dto';
import { UserLoginRequestDto } from '@/modules/user/dtos/request/user.login.request.dto';
import { UserSendEmailVerificationRequestDto } from '@/modules/user/dtos/request/user.send-email-verification.request.dto';
import { UserSignUpRequestDto } from '@/modules/user/dtos/request/user.sign-up.request.dto';
import { UserVerifyEmailRequestDto } from '@/modules/user/dtos/request/user.verify-email.request.dto';
import { UserLoginResponseDto } from '@/modules/auth/dtos/response/auth.login.response.dto';
import {
  EnumUserLoginWith,
  GeoLocation,
  UserAgent,
} from '@/generated/prisma-client';
import { AuthService } from '../services/auth.service';

@ApiTags('modules.public.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthPublicController {
  constructor(private readonly authService: AuthService) {}

  @AuthPublicLoginCredentialDoc()
  @Response('auth.loginCredential')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/login/credential')
  async loginWithCredential(
    @Body() body: UserLoginRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    return this.authService.loginCredential(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthPublicLoginSocialGoogleDoc()
  @Response('auth.loginWithSocialGoogle')
  @AuthSocialGoogleProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/login/social/google')
  async loginWithGoogle(
    @AuthJwtPayload<IAuthSocialPayload>('email')
    email: string,
    @Body() body: UserCreateSocialRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    return this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.socialGoogle,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      }
    );
  }

  @AuthPublicLoginSocialAppleDoc()
  @Response('auth.loginWithSocialApple')
  @AuthSocialAppleProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/login/social/apple')
  async loginWithApple(
    @AuthJwtPayload<IAuthSocialPayload>('email')
    email: string,
    @Body() body: UserCreateSocialRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<UserLoginResponseDto>> {
    return this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.socialApple,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      }
    );
  }

  @AuthPublicSignUpDoc()
  @Response('auth.signUp')
  @ApiKeyProtected()
  @Post('/sign-up')
  async signUp(
    @Body()
    body: UserSignUpRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.signUp(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthPublicVerifyEmailDoc()
  @Response('auth.verifyEmail')
  @ApiKeyProtected()
  @Patch('/verify/email')
  async verifyEmail(
    @Body() body: UserVerifyEmailRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.verifyEmail(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthPublicSendEmailVerificationDoc()
  @Response('auth.sendEmailVerification')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/send/email')
  async sendEmailVerification(
    @Body() body: UserSendEmailVerificationRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.sendVerificationEmail(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthPublicForgotPasswordDoc()
  @Response('auth.forgotPassword')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/password/forgot')
  async forgotPassword(
    @Body() body: UserForgotPasswordRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.forgotPassword(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthPublicResetPasswordDoc()
  @Response('auth.resetPassword')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Patch('/password/reset')
  async reset(
    @Body() body: UserForgotPasswordResetRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.resetPassword(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }
}
