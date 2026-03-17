import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { MessageDoc, MessageEntity } from '../entities/message.entity';
import { Model, PopulateOptions } from 'mongoose';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { ConversationEntity } from '../entities/conversation.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

export class MessageRepository extends DatabaseRepositoryBase<
  MessageEntity,
  MessageDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'conversation',
      localField: 'conversation',
      foreignField: '_id',
      model: ConversationEntity.name,
      justOne: true,
    },
    {
      path: 'sender',
      localField: 'sender',
      foreignField: '_id',
      model: UserEntity.name,
      select: '_id name email',
      justOne: true,
    },
    {
      path: 'receiver',
      localField: 'receiver',
      foreignField: '_id',
      model: UserEntity.name,
      select: '_id name email',
      justOne: true,
    },
    {
      path: 'readBy',
      localField: 'readBy',
      foreignField: '_id',
      model: UserEntity.name,
      select: '_id name email',
      justOne: false,
    },
  ];

  constructor(
    @InjectDatabaseModel(MessageEntity.name)
    private readonly messageModel: Model<MessageEntity>,
  ) {
    super(messageModel, [
      {
        path: 'conversation',
        localField: 'conversation',
        foreignField: '_id',
        model: ConversationEntity.name,
        justOne: true,
      },
      {
        path: 'sender',
        localField: 'sender',
        foreignField: '_id',
        model: UserEntity.name,
        select: '_id name email',
        justOne: true,
      },
      {
        path: 'receiver',
        localField: 'receiver',
        foreignField: '_id',
        model: UserEntity.name,
        select: '_id name email',
        justOne: true,
      },
      {
        path: 'readBy',
        localField: 'readBy',
        foreignField: '_id',
        model: UserEntity.name,
        select: '_id name email',
        justOne: false,
      },
    ]);
  }
}
