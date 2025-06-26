import { StoreDoc, StoreEntity } from '../entities/store.entity';
import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';

export interface IStoreEntity extends Omit<StoreEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface IStoreDoc extends Omit<StoreDoc, 'createdBy'> {
  createdBy: UserDoc;
}
