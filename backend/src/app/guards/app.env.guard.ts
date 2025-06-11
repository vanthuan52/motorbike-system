import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ENUM_NODE_ENVIRONMENT } from '../enums/app.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '../enums/app.status-code.num';
import { NODE_ENV_META_KEY } from '../constants/app.constant';

@Injectable()
export class AppEnvGuard implements CanActivate {
  private readonly env: ENUM_NODE_ENVIRONMENT;

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    this.env =
      this.configService.get<ENUM_NODE_ENVIRONMENT>('app.env') ??
      ENUM_NODE_ENVIRONMENT.DEVELOPMENT;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: ENUM_NODE_ENVIRONMENT[] = this.reflector.getAllAndOverride<
      ENUM_NODE_ENVIRONMENT[]
    >(NODE_ENV_META_KEY, [context.getHandler(), context.getClass()]);

    if (!required) {
      return true;
    } else if (!required.includes(this.env)) {
      throw new ForbiddenException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.ENV_FORBIDDEN,
        message: 'http.clientError.forbidden',
      });
    }

    return true;
  }
}
