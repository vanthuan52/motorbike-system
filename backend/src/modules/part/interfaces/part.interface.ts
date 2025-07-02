import { PartDoc, PartEntity } from '../entities/part.entity';

export interface IPartEntity extends Omit<PartEntity, 'part'> {
  part: PartEntity;
}

export interface IPartDoc extends Omit<PartDoc, 'part'> {
  part: PartDoc;
}
