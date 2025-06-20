import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import { HiringDoc, HiringEntity } from '../entities/hiring.entity';

export interface IHiringEntity extends Omit<HiringEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface IHiringDoc extends Omit<HiringDoc, 'createdBy'> {
  createdBy: UserDoc;
}
