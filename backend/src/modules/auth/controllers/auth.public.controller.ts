import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import {
  AuthPublicLoginCredentialDoc,
  AuthPublicLoginSocialAppleDoc,
  AuthPublicLoginSocialGoogleDoc,
  UserPublicSignUpDoc,
} from '../docs/auth.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { EnumUserLoginWith } from '@/modules/user/enums/user.enum';
import { AuthSignUpRequestDto } from '../dtos/request/auth.sign-up.request.dto';
import { AuthJwtPayload } from '../decorators/auth.jwt.decorator';
import { IAuthSocialPayload } from '../interfaces/auth.interface';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import {
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { UserLoginRequestDto } from '../dtos/request/auth.login.request.dto';
import {
  AuthSocialAppleProtected,
  AuthSocialGoogleProtected,
} from '../decorators/auth.social.decorator';
import { UserCreateSocialRequestDto } from '@/modules/user/dtos/request/user.create-social.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('modules.public.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthPublicController {
  constructor(private readonly authService: AuthService) {}

  @AuthPublicLoginCredentialDoc()
  @Response('auth.loginWithCredential')
  @HttpCode(HttpStatus.OK)
  @Post('/login/credential')
  async loginWithCredential(
    @Body() body: UserLoginRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };
    const tokens = await this.authService.loginCredential(body, requestLog);
    return {
      data: tokens,
    };
  }

  @AuthPublicLoginSocialGoogleDoc()
  @Response('user.loginWithSocialGoogle')
  @AuthSocialGoogleProtected()
  @Post('/login/social/google')
  async loginWithGoogle(
    @AuthJwtPayload<IAuthSocialPayload>('email')
    email: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
    @Body() body: UserCreateSocialRequestDto,
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };
    const tokens = await this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.google,
      body,
      requestLog,
    );

    return {
      data: tokens,
    };
  }

  @AuthPublicLoginSocialAppleDoc()
  @Response('user.loginWithSocialApple')
  @AuthSocialAppleProtected()
  @Post('/login/social/apple')
  async loginWithApple(
    @AuthJwtPayload<IAuthSocialPayload>('email')
    email: string,
    @Body() body: UserCreateSocialRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };

    const tokens = await this.authService.loginWithSocial(
      email,
      EnumUserLoginWith.apple,
      body,
      requestLog,
    );

    return { data: tokens };
  }

  @UserPublicSignUpDoc()
  @Response('auth.signUp')
  @Post('/sign-up')
  async signUp(
    @Body() body: AuthSignUpRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<void>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };
    await this.authService.signUp(body, requestLog);
    return {};
  }
}
