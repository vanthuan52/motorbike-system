import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';

/**
 * Two-Factor Authentication embedded entity
 * Used as embedded document within UserEntity
 */
export class TwoFactorEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    type: String,
    index: true,
  })
  userId: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  secret?: string;

  @DatabaseProp({
    required: false,
    type: String,
  })
  iv?: string;

  @DatabaseProp({
    required: false,
    type: [String],
    default: [],
  })
  backupCodes?: string[];

  @DatabaseProp({
    required: true,
    type: Boolean,
    default: false,
  })
  enabled: boolean;

  @DatabaseProp({
    required: true,
    type: Boolean,
    default: false,
  })
  requiredSetup: boolean;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  confirmedAt?: Date;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  lastUsedAt?: Date;

  @DatabaseProp({
    required: true,
    type: Number,
    default: 0,
  })
  attempt: number;
}

export const TwoFactorSchema = DatabaseSchema(TwoFactorEntity);
