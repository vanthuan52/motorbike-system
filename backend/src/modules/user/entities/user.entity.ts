import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_USER_STATUS } from '../enums/user.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { RoleEntity } from '@/modules/role/entities/role.entity';

export const UserTableName = 'users';

@DatabaseEntity({ collection: UserTableName })
export class UserEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @DatabaseProp({
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    trim: true,
    maxlength: 100,
    type: String,
  })
  email: string;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 20,
    minlength: 8,
  })
  phone?: string;

  @DatabaseProp({
    required: true,
    trim: true,
    select: false,
  })
  password: string;

  @DatabaseProp({
    required: true,
    ref: RoleEntity.name,
    index: true,
    trim: true,
  })
  role: string;

  @DatabaseProp({
    required: true,
    default: ENUM_USER_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_USER_STATUS,
  })
  status: ENUM_USER_STATUS;
}

export const UserSchema = DatabaseSchema(UserEntity);

export type UserDoc = IDatabaseDocument<UserEntity>;
