import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { SessionListResponseDto } from '../dtos/response/session.list.response.dto';
import { SessionDocParamsId } from '../constants/session.doc.constant';

export function SessionSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all user sessions',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponsePaging<SessionListResponseDto>('session.list', {
      dto: SessionListResponseDto,
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
    DocResponse('session.revoke'),
  );
}
