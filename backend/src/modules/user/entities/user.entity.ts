import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  EnumUserGender,
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumUserSignUpFrom,
  EnumUserSignUpWith,
  EnumUserStatus,
} from '../enums/user.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { RoleDoc, RoleEntity } from '@/modules/role/entities/role.entity';
import { IMediaEmbedded } from '@/modules/media/interfaces/media.interface';
import { TwoFactorEntity } from './two-factor.entity';

export const UserTableName = 'users';

@DatabaseEntity({ collection: UserTableName })
export class UserEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 100,
  })
  name?: string;

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
    required: false,
    trim: true,
    type: String,
  })
  password?: string;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  passwordExpired?: Date;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  passwordCreated?: Date;

  @DatabaseProp({
    required: false,
    type: Number,
    default: 0,
  })
  passwordAttempt?: number;

  @DatabaseProp({
    required: false,
    type: Boolean,
    default: false,
  })
  isVerified?: boolean;

  @DatabaseProp({
    required: false,
    type: Date,
  })
  verifiedAt?: Date;

  @DatabaseProp({
    required: true,
    ref: () => RoleEntity.name,
    index: true,
    type: String,
  })
  role: string | RoleDoc;

  @DatabaseProp({
    required: true,
    default: EnumUserStatus.active,
    index: true,
    type: String,
    enum: EnumUserStatus,
  })
  status: EnumUserStatus;

  @DatabaseProp({
    required: false,
    type: String,
    enum: EnumUserGender,
  })
  gender?: EnumUserGender;

  /**
   * User profile photo (embedded media data)
   * @description Stores lightweight media info for avatar display
   * Contains: _id, key, mimeType, completedUrl, cdnUrl
   */
  @DatabaseProp({
    required: false,
    type: Object,
    _id: false,
  })
  photo?: IMediaEmbedded;

  // Sign up tracking
  @DatabaseProp({
    required: false,
    type: Date,
  })
  signUpDate?: Date;

  @DatabaseProp({
    required: false,
    type: String,
    enum: EnumUserSignUpFrom,
  })
  signUpFrom?: EnumUserSignUpFrom;

  @DatabaseProp({
    required: false,
    type: String,
    enum: EnumUserSignUpWith,
  })
  signUpWith?: EnumUserSignUpWith;

  // Last login tracking
  @DatabaseProp({
    required: false,
    type: Date,
  })
  lastLoginAt?: Date;

  @DatabaseProp({
    required: false,
    trim: true,
    maxlength: 50,
  })
  lastIPAddress?: string;

  @DatabaseProp({
    required: false,
    type: String,
    enum: EnumUserLoginFrom,
  })
  lastLoginFrom?: EnumUserLoginFrom;

  @DatabaseProp({
    required: false,
    type: String,
    enum: EnumUserLoginWith,
  })
  lastLoginWith?: EnumUserLoginWith;

  @DatabaseProp({
    required: false,
    type: Object,
    _id: false,
  })
  twoFactor?: TwoFactorEntity;
}

export const UserSchema = DatabaseSchema(UserEntity);

export type UserDoc = IDatabaseDocument<UserEntity>;
