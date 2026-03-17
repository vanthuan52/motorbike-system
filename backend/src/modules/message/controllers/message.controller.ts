import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Put,
} from '@nestjs/common';
import { Response } from '@/common/response/decorators/response.decorator';
import { ApiTags } from '@nestjs/swagger';
import { MessageListDoc, MessageUpdateStatusDoc } from '../docs/message.doc';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { MessageService } from '../services/message.service';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { MessageDoc } from '../entities/message.entity';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { MessageUpdateStatusRequestDto } from '../dtos/request/message-update-status.request.dto';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.num';

@ApiTags('modules.chat')
@Controller({
  version: '1',
  path: '/messages',
})
export class MessageSharedController {
  constructor(private readonly messageService: MessageService) {}

  @MessageListDoc()
  @ResponsePaging('chat.message.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/:conversationId/messages')
  async listMessages(
    @PaginationOffsetQuery({})
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    @Param('conversationId', OptionalParseUUIDPipe)
    conversationId: string,
  ): Promise<IResponsePagingReturn<MessageGetResponseDto>> {
    const find: Record<string, any> = {
      ...where,
    };

    if (conversationId) find['conversation'] = conversationId;

    const messages = await this.messageService.findAllMessagesWithPopulate(
      find,
      {
        paging: {
          limit,
          offset: skip,
        },
        order: orderBy,
      },
    );

    const total: number = await this.messageService.getTotalWithPopulate(find);
    const totalPage: number = Math.ceil(total / limit);
    const mapped = this.messageService.mapListMessage(messages);

    const page = Math.floor(skip / limit) + 1;
    const hasNext = page < totalPage;
    const hasPrevious = page > 1;

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: limit,
      page,
      totalPage,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: hasPrevious ? page - 1 : undefined,
      data: mapped,
    };
  }

  @MessageUpdateStatusDoc()
  @Response('message.message.updateStatus')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/:messageId/status')
  async updateStatusMessage(
    @Param('messageId', RequestRequiredPipe)
    message: MessageDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: MessageUpdateStatusRequestDto,
  ): Promise<void> {
    try {
      await this.messageService.updateStatusMessage(
        message,
        { status },
        { actionBy: updatedBy },
      );
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'message.error.updateStatusFailed',
        _error: err,
      });
    }
  }
}
