import {
  Doc,
  DocAuth,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';

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
