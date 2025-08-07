import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { MessageEntity } from './message.entity';

export const ConversationTableName = 'conversations';

@DatabaseEntity({ collection: ConversationTableName })
export class ConversationEntity extends DatabaseEntityBase {
  @DatabaseProp({
    type: [String],
    ref: () => UserEntity.name,
    required: true,
    index: true,
  })
  participants: string[];

  @DatabaseProp({
    required: false,
    default: null,
    ref: () => MessageEntity.name,
    index: true,
    trim: true,
  })
  lastMessage?: string;
}
export const ConversationSchema = DatabaseSchema(ConversationEntity);
ConversationSchema.index({ participants: 1 }, { unique: true, sparse: true });

export type ConversationDoc = IDatabaseDocument<ConversationEntity>;
