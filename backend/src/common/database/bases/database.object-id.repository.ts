import { Types } from 'mongoose';
import { IDatabaseDocument } from '../interfaces/database.interface';
import { DatabaseObjectIdEntityBase } from './database.object-id.entity';
import { DatabaseRepositoryAbstract } from './abstract/database.repository.abstract';

export class DatabaseObjectIdRepositoryBase<
  Entity extends DatabaseObjectIdEntityBase,
  EntityDocument extends IDatabaseDocument<Entity>,
> extends DatabaseRepositoryAbstract<Entity, EntityDocument> {
  // Override abstract method to handle ID conversion (String to ObjectId)
  protected convertToId(id: string | Types.ObjectId): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }
}
