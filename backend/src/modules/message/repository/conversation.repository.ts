import { DatabaseRepositoryBase } from '@/common/database/bases/database.repository';
import {
  ConversationDoc,
  ConversationEntity,
} from '../entities/conversation.entity';
import { Model, PopulateOptions } from 'mongoose';
import { InjectDatabaseModel } from '@/common/database/decorators/database.decorator';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { MessageEntity } from '../entities/message.entity';

export class ConversationRepository extends DatabaseRepositoryBase<
  ConversationEntity,
  ConversationDoc
> {
  readonly _joinActive: PopulateOptions[] = [
    {
      path: 'participants',
      model: UserEntity.name,
    },
    {
      path: 'lastMessageId',
      model: MessageEntity.name,
    },
  ];

  constructor(
    @InjectDatabaseModel(ConversationEntity.name)
    private readonly conversationModel: Model<ConversationEntity>,
  ) {
    super(conversationModel, [
      {
        path: 'participants',
        model: UserEntity.name,
      },
      {
        path: 'lastMessageId',
        model: MessageEntity.name,
      },
    ]);
  }

  getEntityClass(): typeof ConversationEntity {
    return ConversationEntity;
  }
}
