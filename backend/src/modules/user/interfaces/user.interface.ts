import { RoleDoc, RoleEntity } from '@/modules/role/entities/role.entity';
import { UserDoc, UserEntity } from '../entities/user.entity';

export interface IUserEntity extends Omit<UserEntity, 'role'> {
  role: RoleEntity;
}

export interface IUserDoc extends Omit<UserDoc, 'role'> {
  role: RoleDoc;
}
