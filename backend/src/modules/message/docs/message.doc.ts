import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import {
  MessageDocParamsId,
  MessageDocParamsIdMessageId,
} from '../constants/message.doc.constant';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { MessageUpdateStatusRequestDto } from '../dtos/request/message-update-status.request.dto';

export function MessageListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'list messages by conversation id',
    }),
    DocRequest({
      params: MessageDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponsePaging<MessageGetResponseDto>('message.list', {
      dto: MessageGetResponseDto,
    }),
  );
}

export function MessageUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Mark a message as read',
    }),
    DocRequest({
      params: MessageDocParamsIdMessageId,
      bodyType: EnumDocRequestBodyType.json,
      dto: MessageUpdateStatusRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocResponse<MessageGetResponseDto>('message.updateStatus', {
      dto: MessageGetResponseDto,
    }),
  );
}
