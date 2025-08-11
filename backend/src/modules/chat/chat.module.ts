import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../user/user.module';
import { ChatService } from './services/chat.service';
import { ChatRepositoryModule } from './repository/chat.repository.module';

@Module({
  imports: [UserModule, ChatRepositoryModule],
  controllers: [],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatRepositoryModule],
})
export class ChatModule {}
