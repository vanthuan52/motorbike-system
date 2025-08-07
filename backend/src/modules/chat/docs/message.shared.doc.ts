import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { applyDecorators } from '@nestjs/common';
import { SendMessageDto } from '../dtos/request/send-message.dto';

export function MessageSharedSendMessageDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'send message',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: SendMessageDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse('message.send'),
  );
}
