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
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { MessageGetResponseDto } from '../dtos/response/message-response.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { MessageUpdateStatusRequestDto } from '../dtos/request/message-update-status.request.dto';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import { Message, Prisma } from '@/generated/prisma-client';

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
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >,
    @Param('conversationId', RequestOptionalParseObjectIdPipe)
    conversationId: string
  ): Promise<IResponsePagingReturn<MessageGetResponseDto>> {
    const where_query: Prisma.MessageWhereInput = {
      ...where,
    };

    if (conversationId) {
      where_query.conversationId = conversationId;
    }

    const messages =
      await this.messageService.findAllMessagesWithPopulate(where_query);

    const total: number =
      await this.messageService.getTotalWithPopulate(where_query);
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
    messageId: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: MessageUpdateStatusRequestDto
  ): Promise<void> {
    try {
      const message = await this.messageService.findOneById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }
      await this.messageService.updateStatusMessage(message, { status });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'message.error.updateStatusFailed',
        _error: err,
      });
    }
  }
}
