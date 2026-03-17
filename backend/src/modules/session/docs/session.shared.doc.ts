import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { SessionListResponseDto } from '@/modules/session/dtos/response/session.list.response.dto';
import { SessionDocParamsId } from '@/modules/session/constants/session.doc.constant';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';

export function SessionSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all user sessions',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({}),
    DocResponsePaging<SessionListResponseDto>('session.list', {
      dto: SessionListResponseDto,
      type: EnumPaginationType.cursor,
    }),
  );
}

export function SessionSharedRevokeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'revoke user session',
    }),
    DocRequest({
      params: SessionDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({}),
    DocResponse('session.revoke'),
  );
}
