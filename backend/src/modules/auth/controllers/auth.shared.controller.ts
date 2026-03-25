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
import {
  AuthSharedChangePasswordDoc,
  AuthSharedRefreshDoc,
} from '../docs/auth.shared.doc';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  GeoLocation,
  IUser,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

@ApiTags('modules.shared.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AuthSharedController {
  constructor(private readonly authService: AuthService) {}

  @AuthSharedChangePasswordDoc()
  @Response('user.changePassword')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/change-password')
  async changePassword(
    @UserCurrent() user: IUser,
    @Body() body: AuthChangePasswordRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    return this.authService.changePassword(user, body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }

  @AuthSharedRefreshDoc()
  @Response('user.refresh')
  @UserProtected()
  @AuthJwtRefreshProtected()
  @ApiKeyProtected()
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @UserCurrent() user: IUser,
    @AuthJwtToken() refreshToken: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<AuthTokenResponseDto>> {
    return this.authService.refresh(user, refreshToken, {
      ipAddress,
      userAgent,
      geoLocation,
    });
  }
}
