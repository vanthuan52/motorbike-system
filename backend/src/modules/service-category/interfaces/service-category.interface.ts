import { UserDoc, UserEntity } from '@/modules/user/entities/user.entity';
import {
  ServiceCategoryDoc,
  ServiceCategoryEntity,
} from '../entities/service-category.entity';

export interface IServiceCategoryEntity
  extends Omit<ServiceCategoryEntity, 'createdBy'> {
  createdBy: UserEntity;
}

export interface IServiceCategoryDoc
  extends Omit<ServiceCategoryDoc, 'createdBy'> {
  createdBy: UserDoc;
}
