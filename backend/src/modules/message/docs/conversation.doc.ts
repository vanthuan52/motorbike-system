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
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';

export function ConversationGetDoc(): MethodDecorator {
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
    })
  );
}

export function ConversationCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create conversation',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
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
    })
  );
}
