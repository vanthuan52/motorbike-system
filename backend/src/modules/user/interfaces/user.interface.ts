import { UserDocument, UserEntity } from '../entities/user.entity';

export interface IUserEntity extends Omit<UserEntity, 'role'> {}

export interface IUserDoc extends Omit<UserDocument, 'role'> {}
