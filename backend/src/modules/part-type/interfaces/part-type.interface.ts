import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import { PartTypeDoc, PartTypeEntity } from '../entities/part-type.entity';

export interface IPartTypeEntity extends Omit<PartTypeEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface IPartTypeDoc extends Omit<PartTypeDoc, 'createdBy'> {
  createdBy: UserDoc;
}
