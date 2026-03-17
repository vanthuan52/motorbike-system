import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { AuthChangePasswordRequestDto } from '../dtos/request/auth.change-password.request.dto';
import { AuthTokenResponseDto } from '../dtos/response/auth.token.response.dto';

export function AuthChangePasswordDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Change password',
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AuthChangePasswordRequestDto,
    }),
    DocResponse('auth.changePassword'),
  );
}

export function AuthRefreshDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'refresh a token',
    }),
    DocAuth({
      xApiKey: false,
      jwtRefreshToken: true,
    }),
    DocResponse<AuthTokenResponseDto>('auth.refresh', {
      dto: AuthTokenResponseDto,
    }),
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
    DocResponse('auth.logout'),
  );
}
