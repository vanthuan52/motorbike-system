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
import { IAuthSocialPayload } from '@/modules/auth/interfaces/auth.interface';
import {
  AuthPublicForgotPasswordDoc,
  AuthPublicLoginCredentialDoc,
  AuthPublicLoginSocialAppleDoc,
  AuthPublicLoginSocialGoogleDoc,
  AuthPublicResetPasswordDoc,
  AuthPublicSendEmailVerificationDoc,
  AuthPublicSignUpDoc,
  AuthPublicVerifyEmailDoc,
} from '@/modules/auth/docs/auth.public.doc';
import { AuthCreateSocialRequestDto } from '@/modules/auth/dtos/request/auth.create-social.request.dto';
import { AuthForgotPasswordResetRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password-reset.request.dto';
import { AuthForgotPasswordRequestDto } from '@/modules/auth/dtos/request/auth.forgot-password.request.dto';
import { AuthLoginRequestDto } from '@/modules/auth/dtos/request/auth.login.request.dto';
import { AuthSendEmailVerificationRequestDto } from '@/modules/auth/dtos/request/auth.send-email-verification.request.dto';
import { AuthSignUpRequestDto } from '@/modules/auth/dtos/request/auth.sign-up.request.dto';
import { AuthVerifyEmailRequestDto } from '@/modules/auth/dtos/request/auth.verify-email.request.dto';
import { AuthLoginResponseDto } from '@/modules/auth/dtos/response/auth.login.response.dto';
import { AuthService } from '../services/auth.service';
import { EnumUserLoginWith } from '@/modules/user/enums/user.enum';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

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
    @Body() body: AuthLoginRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<AuthLoginResponseDto>> {
    const authResponse = await this.authService.loginCredential(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return {
      data: authResponse,
    };
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
    @Body() body: AuthCreateSocialRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<AuthLoginResponseDto>> {
    const tokens = await this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.socialGoogle,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      }
    );

    return {
      data: tokens,
    };
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
    @Body() body: AuthCreateSocialRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<AuthLoginResponseDto>> {
    const tokens = await this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.socialApple,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      }
    );

    return {
      data: tokens,
    };
  }

  @AuthPublicSignUpDoc()
  @Response('auth.signUp')
  @ApiKeyProtected()
  @Post('/sign-up')
  async signUp(
    @Body()
    body: AuthSignUpRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.authService.signUp(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return;
  }

  @AuthPublicVerifyEmailDoc()
  @Response('auth.verifyEmail')
  @ApiKeyProtected()
  @Patch('/verify/email')
  async verifyEmail(
    @Body() body: AuthVerifyEmailRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.authService.verifyEmail(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return;
  }

  @AuthPublicSendEmailVerificationDoc()
  @Response('auth.sendEmailVerification')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/send/email')
  async sendEmailVerification(
    @Body() body: AuthSendEmailVerificationRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.authService.sendVerificationEmail(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return;
  }

  @AuthPublicForgotPasswordDoc()
  @Response('auth.forgotPassword')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/password/forgot')
  async forgotPassword(
    @Body() body: AuthForgotPasswordRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.authService.forgotPassword(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return;
  }

  @AuthPublicResetPasswordDoc()
  @Response('auth.resetPassword')
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Patch('/password/reset')
  async reset(
    @Body() body: AuthForgotPasswordResetRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.authService.resetPassword(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });

    return;
  }
}
