// conversation.entity.ts
import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const ConversationTableName = 'conversations';

@DatabaseEntity({ collection: ConversationTableName })
export class ConversationEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    type: [String],
    index: true,
  })
  participants: string[];

  @DatabaseProp({
    required: false,
    default: null,
    type: String,
    index: true,
  })
  lastMessageId?: string;
}
export const ConversationSchema = DatabaseSchema(ConversationEntity);
ConversationSchema.index({ participants: 1 }, { unique: true, sparse: true });

export type ConversationDoc = IDatabaseDocument<ConversationEntity>;
