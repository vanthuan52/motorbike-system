import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Response } from '@/common/response/decorators/response.decorator';
import {
  UserCurrent,
  UserProtected,
} from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtRefreshProtected,
  AuthJwtToken,
} from '../decorators/auth.jwt.decorator';
import { AuthChangePasswordDoc, AuthRefreshDoc } from '../docs/auth.doc';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import {
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { RequestUserAgentDto } from '@/common/request/dtos/request.user-agent.dto';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

@ApiTags('modules.shared.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthSharedController {
  constructor(private readonly authService: AuthService) {}

  @AuthChangePasswordDoc()
  @Response('auth.changePassword')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/change-password')
  async changePassword(
    @UserCurrent() user: IUserDoc,
    @Body() body: AuthChangePasswordRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<void>> {
    await this.authService.changePassword(user, body, {
      ipAddress,
      userAgent,
    });

    return {};
  }

  @AuthRefreshDoc()
  @Response('auth.refresh')
  @UserProtected()
  @AuthJwtRefreshProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @UserCurrent() user: IUserDoc,
    @AuthJwtToken() refreshToken: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: RequestUserAgentDto,
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    const requestLog: IRequestLog = {
      ipAddress,
      userAgent,
    };

    await this.authService.refreshToken(user, refreshToken, requestLog);
    return {};
  }
}
