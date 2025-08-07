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
} from '../constants/chat.doc.constant';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { MessageSharedUpdateStatusRequestDto } from '../dtos/request/message-update-stauts.request.dto';

export function MessageSharedListDoc(): MethodDecorator {
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
    DocResponsePaging<MessageGetResponseDto>('conversation.list', {
      dto: MessageGetResponseDto,
    }),
  );
}

export function MessageSharedUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'Mark a message as read',
    }),
    DocRequest({
      params: MessageDocParamsIdMessageId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: MessageSharedUpdateStatusRequestDto,
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
