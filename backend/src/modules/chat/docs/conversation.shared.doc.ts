import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';

export function ConversationSharedGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get conversation',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse<ConversationGetResponseDto>('conversation.get', {
      dto: ConversationGetResponseDto,
    }),
  );
}

export function ConversationSharedCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create conversation',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: ConversationCreateRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({
      role: true,
      policy: true,
    }),
    DocResponse<ConversationGetResponseDto>('conversation.create', {
      dto: ConversationGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}
