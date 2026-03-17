import { IDatabaseDocument } from '../interfaces/database.interface';
import { DatabaseEntityBase } from './database.entity';
import { DatabaseRepositoryAbstract } from './abstract/database.repository.abstract';

export class DatabaseRepositoryBase<
  Entity extends DatabaseEntityBase,
  EntityDocument extends IDatabaseDocument<Entity>,
> extends DatabaseRepositoryAbstract<Entity, EntityDocument> {
  // Override abstract method to handle ID conversion (UUID is already string)
  protected convertToId(id: string): string {
    return id;
  }
}
