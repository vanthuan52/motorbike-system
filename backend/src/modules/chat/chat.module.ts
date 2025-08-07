import { Module } from '@nestjs/common';
import { MessageSharedController } from './controllers/message.shared.controller';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { ChatService } from './services/chat.service';
import { ChatRepositoryModule } from './repository/chat.repository.module';
import { ConversationSharedController } from './controllers/conversation.shared.controller';

@Module({
  imports: [UserModule, ChatRepositoryModule],
  controllers: [MessageSharedController, ConversationSharedController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatRepositoryModule],
})
export class ChatModule {}
