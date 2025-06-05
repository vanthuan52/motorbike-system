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
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { SessionDocParamsId } from '../constants/session.doc.constant';

export function SessionAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all user sessions',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<SessionListResponseDto>('session.list', {
      dto: SessionListResponseDto,
    }),
  );
}

export function SessionAdminRevokeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'revoke user session',
    }),
    DocRequest({
      params: [...SessionDocParamsId, ...UserDocParamsId],
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse('session.revoke'),
  );
}
