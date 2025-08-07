import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { ENUM_MESSAGE_STATUS, ENUM_MESSAGE_TYPE } from '../enums/message.enum';
import { ConversationEntity } from './conversation.entity';

export const MessageTableName = 'messages';

@DatabaseEntity({ collection: MessageTableName })
export class MessageEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => ConversationEntity.name,
    index: true,
    trim: true,
  })
  conversation: string;

  @DatabaseProp({
    required: true,
    ref: () => UserEntity.name,
    index: true,
  })
  sender: string;

  @DatabaseProp({
    required: true,
    ref: () => UserEntity.name,
    index: true,
  })
  receiver: string;

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
    type: [String],
    ref: () => UserEntity.name,
    required: true,
    index: true,
    default: [],
  })
  readBy?: string[];
}

export const MessageSchema = DatabaseSchema(MessageEntity);

export type MessageDoc = IDatabaseDocument<MessageEntity>;
