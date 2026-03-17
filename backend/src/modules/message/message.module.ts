import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { UserModule } from '../user/user.module';
import { MessageService } from './services/message.service';
import { ConversationService } from './services/conversation.service';
import { MessageRepositoryModule } from './repository/message.repository.module';
import { ConversationRepositoryModule } from './repository/conversation.repository.module';

@Module({
  imports: [UserModule, MessageRepositoryModule, ConversationRepositoryModule],
  controllers: [],
  providers: [MessageService, ConversationService, MessageGateway],
  exports: [MessageService, ConversationService],
})
export class MessageModule {}
