import { Model, PopulateOptions } from 'mongoose';
import {
  IDatabaseDocument,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from '../interfaces/database.interface';
import { DatabaseEntityBase } from './database.entity';

export class DatabaseRepositoryBase<
  Entity extends DatabaseEntityBase,
  EntityDocument extends IDatabaseDocument<Entity>,
> {
  protected readonly _repository: Model<Entity>;
  readonly _join?: PopulateOptions | (string | PopulateOptions)[];

  constructor(
    repository: Model<Entity>,
    options?: PopulateOptions | (string | PopulateOptions)[],
  ) {
    this._repository = repository;
    this._join = options;
  }

  async findAll<T = EntityDocument>(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<T[]> {
    const repository = this._repository.find<T>({
      ...find,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.select) {
      repository.select(options.select);
    }

    if (options?.paging) {
      repository.limit(options?.paging.limit).skip(options.paging.offset);
    }

    if (options?.order) {
      repository.sort(options.order);
    }

    if (options?.join) {
      repository.populate(
        (typeof options.join === 'boolean' && options.join
          ? this._join
          : options.join) as PopulateOptions | (string | PopulateOptions)[],
      );
    }

    if (options?.session) {
      repository.session(options.session);
    }

    return repository.exec();
  }

  async findOne<T = EntityDocument>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    const repository = this._repository.findOne<T>({
      ...find,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.select) {
      repository.select(options.select);
    }

    if (options?.join) {
      repository.populate(
        (typeof options.join === 'boolean' && options.join
          ? this._join
          : options.join) as PopulateOptions | (string | PopulateOptions)[],
      );
    }

    if (options?.order) {
      repository.sort(options.order);
    }

    if (options?.session) {
      repository.session(options.session);
    }

    return repository.exec();
  }

  async findOneById<T = EntityDocument>(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    const repository = this._repository.findOne<T>({
      _id,
      deleted: options?.withDeleted ?? false,
    });

    if (options?.select) {
      repository.select(options.select);
    }

    if (options?.join) {
      repository.populate(
        (typeof options.join === 'boolean' && options.join
          ? this._join
          : options.join) as PopulateOptions | (string | PopulateOptions)[],
      );
    }

    if (options?.order) {
      repository.sort(options.order);
    }

    if (options?.session) {
      repository.session(options.session);
    }

    return repository.exec();
  }
}
