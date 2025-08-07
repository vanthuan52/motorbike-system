import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageSharedSendMessageDoc } from '../docs/message.shared.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { SendMessageDto } from '../dtos/request/send-message.dto';
import { ChatService } from '../services/chat.service';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { ConversationDoc } from '../entities/conversation.entity';
import { ENUM_CHAT_STATUS_CODE_ERROR } from '../enums/chat-status-code.enum';

@ApiTags('modules.shared.chat')
@Controller({
  version: '1',
  path: '/messages',
})
export class MessageSharedController {
  constructor(private readonly chatServices: ChatService) {}
}
