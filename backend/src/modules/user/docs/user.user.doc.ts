import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';

export function UserUserDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'user delete their account',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true }),
    DocResponse('user.delete'),
  );
}
