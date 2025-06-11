import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ENUM_NODE_ENVIRONMENT } from '../enums/app.enum';
import { NODE_ENV_META_KEY } from '../constants/app.constant';
import { AppEnvGuard } from '../guards/app.env.guard';

export function AppEnvProtected(
  ...envs: ENUM_NODE_ENVIRONMENT[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(AppEnvGuard),
    SetMetadata(NODE_ENV_META_KEY, envs),
  );
}
