import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isUUID } from 'class-validator';
import { ENUM_AUTH_STATUS_CODE_ERROR } from '../../enums/auth.status-code.enum';
import { IAuthJwtAccessTokenPayload } from '../../interfaces/auth.interface';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwtAccess') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.JWT_ACCESS_TOKEN,
        message: 'auth.error.accessTokenUnauthorized',
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
