import { Module } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConversationEntity,
  ConversationSchema,
} from '../entities/conversation.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [ConversationRepository],
  exports: [ConversationRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: ConversationEntity.name, schema: ConversationSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class ConversationRepositoryModule {}
