import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { MessageDoc } from '../entities/message.entity';
import { ENUM_CHAT_STATUS_CODE_ERROR } from '../enums/chat-status-code.enum';
import { ChatService } from '../services/chat.service';

@Injectable()
export class MessageParsePipe implements PipeTransform {
  constructor(private readonly chatService: ChatService) {}

  async transform(value: any): Promise<MessageDoc> {
    const message = await this.chatService.findOneById(value);
    if (!message) {
      throw new NotFoundException({
        statusCode: ENUM_CHAT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'message.error.notFound',
      });
    }
    return message;
  }
}
