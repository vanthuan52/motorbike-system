import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_MESSAGE_TYPE, ENUM_MESSAGE_STATUS } from '../enums/message.enum';

export const MessageTableName = 'messages';

@DatabaseEntity({ collection: MessageTableName })
export class MessageEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    type: String,
    index: true,
  })
  conversationId: string;

  @DatabaseProp({
    required: true,
    type: String,
    index: true,
  })
  senderId: string;

  @DatabaseProp({
    required: true,
    type: String,
    index: true,
  })
  receiverId: string;

  @DatabaseProp({
    required: true,
    type: String,
    maxlength: 2000,
  })
  content: string;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_MESSAGE_TYPE,
    default: ENUM_MESSAGE_TYPE.TEXT,
  })
  messageType: ENUM_MESSAGE_TYPE;

  @DatabaseProp({
    required: true,
    type: Date,
    default: () => new Date(),
    index: true,
  })
  timestamp: Date;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_MESSAGE_STATUS,
    default: ENUM_MESSAGE_STATUS.SENT,
  })
  status: ENUM_MESSAGE_STATUS;

  @DatabaseProp({
    required: false,
    type: [String],
    default: [],
  })
  readBy?: string[];
}

export const MessageSchema = DatabaseSchema(MessageEntity);

export type MessageDoc = IDatabaseDocument<MessageEntity>;
