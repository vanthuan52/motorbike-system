import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageEntity, MessageSchema } from '../entities/message.entity';
import { DATABASE_CONNECTION_NAME } from '@/common/database/constants/database.constant';

@Module({
  providers: [MessageRepository],
  exports: [MessageRepository],
  controllers: [],
  imports: [
    MongooseModule.forFeature(
      [{ name: MessageEntity.name, schema: MessageSchema }],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class MessageRepositoryModule {}
