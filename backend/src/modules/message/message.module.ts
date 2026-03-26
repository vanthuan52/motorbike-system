import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { UserModule } from '../user/user.module';
import { MessageService } from './services/message.service';
import { ConversationService } from './services/conversation.service';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [MessageService, ConversationService, MessageGateway],
  exports: [MessageService, ConversationService],
})
export class MessageModule {}
