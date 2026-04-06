import {
  ServiceChecklistDoc,
  ServiceChecklistEntity,
} from '../entities/service-checklist.entity';

export interface IServiceChecklistEntity extends Omit<
  ServiceChecklistEntity,
  'createdBy'
> {}

export interface IServiceChecklistDoc extends Omit<
  ServiceChecklistDoc,
  'createdBy'
> {}
