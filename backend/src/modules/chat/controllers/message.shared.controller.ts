import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  MessageSharedListDoc,
  MessageSharedUpdateStatusDoc,
} from '../docs/message.shared.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { ChatService } from '../services/chat.service';
import { IResponsePaging } from '@/common/response/interfaces/response.interface';
import { ENUM_CHAT_STATUS_CODE_ERROR } from '../enums/chat-status-code.enum';
import { PaginationQuery } from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { MessageDoc } from '../entities/message.entity';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { MessageParsePipe } from '../pipes/message.parse.pipe';
import { MessageSharedUpdateStatusRequestDto } from '../dtos/request/message-update-stauts.request.dto';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';

@ApiTags('modules.shared.chat')
@Controller({
  version: '1',
  path: '/messages',
})
export class MessageSharedController {
  constructor(
    private readonly chatServices: ChatService,
    private readonly paginationService: PaginationService,
  ) {}

  @MessageSharedListDoc()
  @ResponsePaging('chat.message.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/:conversationId/messages')
  async listMessages(
    @PaginationQuery({})
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Param('conversationId', OptionalParseUUIDPipe)
    conversationId: string,
  ): Promise<IResponsePaging<MessageGetResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (conversationId) find['conversation'] = conversationId;

    const messages = await this.chatServices.findAllMessagesWithPopulate(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.chatServices.getTotalWithPopulate(find);
    const totalPage: number = this.paginationService.totalPage(total, _limit);
    const mapped = this.chatServices.mapListMessage(messages);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @MessageSharedUpdateStatusDoc()
  @Response('chat.message.updateStatus')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/:messageId/status')
  async updateStatusMessage(
    @Param('messageId', RequestRequiredPipe, MessageParsePipe)
    message: MessageDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: MessageSharedUpdateStatusRequestDto,
  ): Promise<void> {
    try {
      await this.chatServices.updateStatusMessage(
        message,
        { status },
        { actionBy: updatedBy },
      );
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'message.error.updateStatusFailed',
        _error: err,
      });
    }
  }
}
