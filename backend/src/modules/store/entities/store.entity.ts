import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_STORE_STATUS } from '../enums/store.enum';

export const StoreTableName = 'store';

@DatabaseEntity({ collection: StoreTableName })
export class StoreEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 300,
  })
  name: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 500,
  })
  address: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  workHours: string;

  @DatabaseProp({
    required: false,
    maxlength: 255,
    default: null,
    trim: true,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  slug: string;

  @DatabaseProp({
    required: true,
    default: ENUM_STORE_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_STORE_STATUS,
  })
  status: ENUM_STORE_STATUS;
}

export const StoreSchema = DatabaseSchema(StoreEntity);

export type StoreDoc = IDatabaseDocument<StoreEntity>;
