import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../enums/auth.status-code.enum';
import {
  IAuthJwtAccessTokenPayload,
  IAuthJwtRefreshTokenPayload,
} from '../../interfaces/auth.interface';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
  handleRequest<T = IAuthJwtRefreshTokenPayload>(
    err: any,
    user: any,
    info: any,
  ): T {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_REFRESH_TOKEN,
        message: 'auth.error.refreshTokenUnauthorized',
        _error: err ? err.message : info.message,
      });
    }

    const { sub } = user as IAuthJwtAccessTokenPayload;
    if (!sub) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_ACCESS_TOKEN,
        message: 'auth.error.accessTokenUnauthorized',
      });
    } else if (!isUUID(sub)) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_ACCESS_TOKEN,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    return user;
  }
}
