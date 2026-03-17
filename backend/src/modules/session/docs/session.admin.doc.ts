import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { UserDocParamsId } from '@/modules/user/constants/user.doc.constant';
import { SessionListResponseDto } from '@/modules/session/dtos/response/session.list.response.dto';
import { SessionDocParamsId } from '@/modules/session/constants/session.doc.constant';

export function SessionAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'admin get all user sessions',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true }),
    DocResponsePaging<SessionListResponseDto>('session.list', {
      dto: SessionListResponseDto,
    }),
  );
}

export function SessionAdminRevokeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'admin revoke user session',
    }),
    DocRequest({
      params: [...UserDocParamsId, ...SessionDocParamsId],
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true }),
    DocResponse('session.revoke'),
  );
}
