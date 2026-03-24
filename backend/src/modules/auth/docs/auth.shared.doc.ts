import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';

export function AuthSharedRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'refresh token',
    }),
    DocAuth({
      xApiKey: true,
      jwtRefreshToken: true,
    }),
    DocGuard({}),
    DocResponse<AuthTokenResponseDto>('auth.response', {
      dto: AuthTokenResponseDto,
    })
  );
}

export function AuthSharedChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'change password',
    }),
    DocGuard({
      termPolicy: true,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthChangePasswordRequestDto,
    }),
    DocResponse('auth.changePassword')
  );
}

export function AuthLogoutDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'logout',
    }),
    DocAuth({
      xApiKey: false,
      jwtRefreshToken: true,
    }),
    DocResponse('auth.logout')
  );
}
