import { CareAreaDoc, CareAreaEntity } from '../entities/care-area.entity';

export interface ICareAreaEntity extends Omit<CareAreaEntity, 'createdBy'> {}

export interface ICareAreaDoc extends Omit<CareAreaDoc, 'createdBy'> {}
