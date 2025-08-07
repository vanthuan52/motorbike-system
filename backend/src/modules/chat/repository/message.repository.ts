import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import { MessageDoc, MessageEntity } from '../entities/message.entity';
import { Model, PopulateOptions } from 'mongoose';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';

export class MessageRepository extends DatabaseRepositoryBase<
  MessageEntity,
  MessageDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'conversation',
      localField: 'conversation',
      foreignField: '_id',
      model: MessageEntity.name,
      justOne: true,
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
        model: MessageEntity.name,
        justOne: true,
      },
    ]);
  }
}
