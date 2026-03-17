import { RoleDoc, RoleEntity } from '@/modules/role/entities/role.entity';
import { UserDoc, UserEntity } from '../entities/user.entity';
import { EnumUserLoginFrom, EnumUserLoginWith } from '../enums/user.enum';

export interface IUserEntity extends Omit<UserEntity, 'role'> {
  role: RoleEntity;
}

export interface IUserDoc extends Omit<UserDoc, 'role'> {
  role: RoleDoc;
}

/**
 * Interface for user login data
 */
export interface IUserLogin {
  loginFrom: EnumUserLoginFrom;
  loginWith: EnumUserLoginWith;
  sessionId: string;
  jti: string;
  expiredAt: Date;
}
