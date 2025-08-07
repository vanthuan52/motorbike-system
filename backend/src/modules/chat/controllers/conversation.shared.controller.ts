import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from '../services/chat.service';
import { Response } from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserActiveParsePipe } from '@/modules/user/pipes/user.parse.pipe';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import { ConversationSharedGetDoc } from '../docs/conversation.shared.doc';
@ApiTags('modules.shared.chat.conversations')
@Controller({
  version: '1',
  path: '/chat/conversations',
})
export class ConversationSharedController {
  constructor(private readonly chatServices: ChatService) {}

  @ConversationSharedGetDoc()
  @Response('conversation.get')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get')
  async get(
    @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserActiveParsePipe)
    user: IUserDoc,
  ): Promise<IResponse<ConversationGetResponseDto>> {
    const conversations = await this.chatServices.mapConversations(user);
    return { data: conversations };
  }
}
