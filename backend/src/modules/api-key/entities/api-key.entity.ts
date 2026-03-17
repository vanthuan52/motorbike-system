import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { EnumApiKeyType } from '../enums/api-key.enum';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const ApiKeyTableName = 'api_keys';

@DatabaseEntity({
  collection: ApiKeyTableName,
})
export class ApiKeyEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    enum: EnumApiKeyType,
    type: String,
    index: true,
    trim: true,
  })
  type: EnumApiKeyType;

  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    minlength: 1,
    maxlength: 100,
    trim: true,
  })
  name: string;

  @DatabaseProp({
    required: true,
    type: String,
    unique: true,
    index: true,
    trim: true,
    maxlength: 50,
  })
  key: string;

  @DatabaseProp({
    required: true,
    trim: true,
    type: String,
  })
  hash: string;

  @DatabaseProp({
    required: true,
    index: true,
    type: Boolean,
  })
  isActive: boolean;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  startDate?: Date;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  endDate?: Date;
}

export const ApiKeySchema = DatabaseSchema(ApiKeyEntity);
export type ApiKeyDoc = IDatabaseDocument<ApiKeyEntity>;
