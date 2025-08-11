import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
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
import {
  ConversationSharedCreateDoc,
  ConversationSharedGetDoc,
} from '../docs/conversation.shared.doc';
import { UserService } from '@/modules/user/services/user.service';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { ConversationCreateRequestDto } from '../dtos/request/conversation-create-request.dto';
import { IDatabaseCreateOptions } from '@/common/database/interfaces/database.interface';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
@ApiTags('modules.shared.chat')
@Controller({
  version: '1',
  path: '/conversations',
})
export class ConversationSharedController {
  constructor(
    private readonly chatServices: ChatService,
    private readonly userService: UserService,
  ) {}

  @ConversationSharedGetDoc()
  @Response('chat.conversation.get')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get')
  async get(
    @AuthJwtPayload<IAuthJwtAccessTokenPayload>('user', UserActiveParsePipe)
    user: IUserDoc,
  ): Promise<IResponse<ConversationGetResponseDto[]>> {
    const conversations = await this.chatServices.getConversationsByUser(user);

    const mapped = conversations.map((c) =>
      this.chatServices.mapConversations(c, user),
    );

    return { data: mapped };
  }

  @ConversationSharedCreateDoc()
  @Response('chat.conversation.create')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async createConversation(
    @Body() body: ConversationCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const { sender, receiver } = body;

    if (!sender || !receiver || sender === receiver) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const participantIds = [sender, receiver];
    const users = await this.userService.findAll({
      _id: { $in: participantIds },
    });

    if (users.length !== 2) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const participantsSorted = participantIds.sort();

    try {
      const existingConversation =
        await this.chatServices.findByParticipants(participantsSorted);

      if (existingConversation) {
        return { data: existingConversation };
      }

      const created = await this.chatServices.create(participantsSorted, {
        actionBy: sender,
      } as IDatabaseCreateOptions);

      return { data: { _id: created._id } };
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
