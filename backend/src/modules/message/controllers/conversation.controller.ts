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
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserActiveParsePipe } from '@/modules/user/pipes/user.parse.pipe';
import { IAuthJwtAccessTokenPayload } from '@/modules/auth/interfaces/auth.interface';
import { IUserDoc } from '@/modules/user/interfaces/user.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ConversationGetResponseDto } from '../dtos/response/get-conversation-response.dto';
import {
  ConversationCreateDoc,
  ConversationGetDoc,
} from '../docs/conversation.doc';
import { UserService } from '@/modules/user/services/user.service';
import { EnumUserStatusCodeError } from '@/modules/user/enums/user.status-code.enum';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.num';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';
import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { ConversationService } from '../services/conversation.service';

@ApiTags('modules.chat')
@Controller({
  version: '1',
  path: '/conversations',
})
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
  ) {}

  @ConversationGetDoc()
  @Response('message.conversation.get')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get')
  async get(
    @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserActiveParsePipe)
    user: IUserDoc,
  ): Promise<IResponseReturn<ConversationGetResponseDto[]>> {
    const conversations =
      await this.conversationService.getConversationsByUser(user);

    const mapped = await Promise.all(
      conversations.map((c) =>
        this.conversationService.mapConversations(c, user),
      ),
    );

    return { data: mapped };
  }

  @ConversationCreateDoc()
  @Response('chat.conversation.create')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async createConversation(
    @Body() body: ConversationCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const { sender, receiver } = body;

    if (!sender || !receiver || sender === receiver) {
      throw new BadRequestException({
        statusCode: EnumUserStatusCodeError.notFound,
        message: 'user.error.notFound',
      });
    }

    const participantIds = [sender, receiver];
    const users = await this.userService.findAll({
      _id: { $in: participantIds },
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
        return { data: existingConversation };
      }

      const created = await this.conversationService.create(
        participantsSorted,
        {
          actionBy: sender,
        } as IDatabaseCreateOptions,
      );

      return { data: { _id: created._id } };
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
