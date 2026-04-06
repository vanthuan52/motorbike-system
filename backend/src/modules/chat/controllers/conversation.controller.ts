import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@/common/response/decorators/response.decorator';
import {
  UserCurrent,
  UserProtected,
} from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import {
  ConversationCreateDoc,
  ConversationGetDoc,
} from '../docs/conversation.doc';
import { UserService } from '@/modules/user/services/user.service';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';
import { ConversationService } from '../services/conversation.service';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';

@ApiTags('modules.chat')
@Controller({
  version: '1',
  path: '/conversations',
})
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService
  ) {}

  @ConversationGetDoc()
  @Response('message.conversation.get')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get')
  async get(
    @AuthJwtPayload() payload: IAuthJwtAccessTokenPayload
  ): Promise<IResponseReturn<ConversationGetResponseDto[]>> {
    const conversations = await this.conversationService.getConversationsByUser(
      payload.userId
    );

    const mapped: ConversationGetResponseDto[] = conversations.map(c => ({
      id: c.id,
      participants: c.participants,
      lastMessage: c.lastMessage,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return { data: mapped };
  }

  @ConversationCreateDoc()
  @Response('chat.conversation.create')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async createConversation(
    @Body() body: ConversationCreateRequestDto
  ): Promise<IResponseReturn<{ id: string }>> {
    const { sender, receiver } = body;

    if (!sender || !receiver || sender === receiver) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const participantIds = [sender, receiver];

    // Verify users exist
    const users = await this.userService.find({
      id: {
        in: participantIds,
      },
    });

    if (users.length !== 2) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const participantsSorted = participantIds.sort();

    try {
      const existingConversation =
        await this.conversationService.findByParticipants(participantsSorted);

      if (existingConversation) {
        return { data: { id: existingConversation.id } };
      }

      const created = await this.conversationService.create(participantsSorted);

      return { data: { id: created.id } };
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
