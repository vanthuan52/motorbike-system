import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { ConversationRepository } from './conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageEntity, MessageSchema } from '../entities/message.entity';
import {
  ConversationEntity,
  ConversationSchema,
} from '../entities/conversation.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [MessageRepository, ConversationRepository],
  exports: [MessageRepository, ConversationRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [
        { name: MessageEntity.name, schema: MessageSchema },
        { name: ConversationEntity.name, schema: ConversationSchema },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ChatRepositoryModule {}
