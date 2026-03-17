import {
  Model,
  PipelineStage,
  PopulateOptions,
  RootFilterQuery,
  Document,
  UpdateQuery,
  Types,
} from 'mongoose';
import {
  DeleteResult,
  InferIdType,
  InsertManyResult,
  UpdateResult as MongoUpdateResult,
  ObjectId,
} from 'mongodb';
import {
  IDatabaseAggregateOptions,
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseDocument,
  IDatabaseExistsOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateManyOptions,
  IDatabaseUpdateOptions,
  IDatabaseUpsertOptions,
} from '../../interfaces/database.interface';
import { DatabaseBaseEntityAbstract } from './database.entity.abstract';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';

/**
 * CustomUpdateResult
 * This interface extends the standard 'UpdateResult' from the MongoDB Driver
 * but overrides the `upsertedId` property
 *
 * The default `UpdateResult` expects `upsertedId` to be of type `ObjectId | null`
 * However, in our schema, `_id` is a `string` (UUID)
 * This custom interface resolves the type incompatibility by allowing `upsertedId`
 * to be either our custom `_id` type (`InferIdType<Entity>`, which is string here)
 * or the default `ObjectId` (as MongoDB might still return `ObjectId` when upserting)
 * a new document, even if our schema converts it to a string on read).
 * This ensures strong type safety when working with update results
 */
export interface CustomUpdateResult<Entity> extends Omit<
  MongoUpdateResult<Document>,
  'upsertedId'
> {
  upsertedId?: InferIdType<Entity> | ObjectId | null;
}

export abstract class DatabaseRepositoryAbstract<
  Entity extends DatabaseBaseEntityAbstract,
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

  // Abstract method to be implemented by subclasses to handle ID conversion
  protected abstract convertToId(id: string | Types.ObjectId): any;

  // Find
  /**
   * Find multiple documents with options for filtering, sorting, paging, and selecting fields.
   */
  async findAll<T = EntityDocument>(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseFindAllOptions,
  ): Promise<T[]> {
    const repository = this._repository.find<T>({
      ...find,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
    });

    if (options?.select) {
      repository.select(options.select);
    }

    if (options?.paging) {
      repository.limit(options.paging.limit).skip(options.paging.offset);
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

  /**
   * Find multiple documents using efficient cursor-based pagination.
   */
  async findAllCursor<T = EntityDocument>(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseFindAllOptions,
  ): Promise<T[]> {
    const filters: Record<string, any> = {
      ...find,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
    };

    if (options?.cursor?.cursor && options?.cursor?.cursorField) {
      const order = options.cursor.order;
      const orderValue =
        order[options.cursor.cursorField] ??
        EnumPaginationOrderDirectionType.desc; // Default to DESC

      const comparison =
        orderValue === EnumPaginationOrderDirectionType.asc ? '$gt' : '$lt';

      let cursorValue: any = options.cursor.cursor;
      if (options.cursor.cursorField === '_id') {
        cursorValue = this.convertToId(options.cursor.cursor);
      }

      filters[options.cursor.cursorField] = {
        [comparison]: cursorValue,
      };
    }

    const repository = this._repository.find<T>(filters);

    if (options?.select) {
      repository.select(options.select);
    }

    if (options?.cursor?.limit) {
      repository.limit(options.cursor.limit);
    }

    if (options?.cursor?.order) {
      repository.sort(options.cursor.order);
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

  /**
   * Find a single document matching criteria.
   */
  async findOne<T = EntityDocument>(
    find: RootFilterQuery<Entity>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    if (!find || typeof find !== 'object') {
      throw new Error('Find criteria must be an object');
    }

    const repository = this._repository.findOne<T>({
      ...find,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
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

  /**
   * Find a single document by its ID.
   */
  async findOneById<T = EntityDocument>(
    _id: string | Types.ObjectId,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    if (!_id) {
      throw new Error('ID must be provided');
    }

    const id = this.convertToId(_id);

    const repository = this._repository.findOne<T>({
      _id: id,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
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

  /**
   * Find a single document and lock it (update timestamp) to prevent concurrent modifications.
   */
  async findOneAndLock<T = EntityDocument>(
    find: RootFilterQuery<Entity>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    const repository = this._repository.findOneAndUpdate<T>(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: false,
        timestamps: true,
      },
    );

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

  /**
   * Find a single document by ID and lock it.
   */
  async findOneByIdAndLock<T = EntityDocument>(
    _id: string | Types.ObjectId,
    options?: IDatabaseFindOneOptions,
  ): Promise<T | null> {
    if (!_id) {
      throw new Error('ID must be provided');
    }

    const id = this.convertToId(_id);

    const repository = this._repository.findOneAndUpdate<T>(
      {
        _id: id,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: false,
        timestamps: true,
      },
    );

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

  /**
   * Get the total count of documents matching criteria.
   */
  async getTotal(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    const repository = this._repository.countDocuments({
      ...find,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
    });

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

    return repository;
  }

  /**
   * Check if any document exists matching the criteria.
   */
  async exists(
    find: RootFilterQuery<Entity>,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    const repository = this._repository.exists({
      ...find,
      ...(!options?.withDeleted && {
        deletedAt: null,
      }),
    });

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

    if (options?.excludeId) {
      const excludeId = this.convertToId(options.excludeId as any);
      repository.where('_id').ne(excludeId);
    }

    const result = await repository;
    return result ? true : false;
  }

  /**
   * Create a new document.
   */
  async create<T extends Entity>(
    data: T,
    options?: IDatabaseCreateOptions,
  ): Promise<EntityDocument> {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Data must be a non-empty object');
    }

    const now = new Date();
    data.createdAt = now;
    data.updatedAt = now;
    data.createdBy = options?.actionBy;

    const created = await this._repository.create([data], options);

    return created[0] as EntityDocument;
  }

  // Action
  /**
   * Update a single document matching criteria.
   */
  async update<T extends Entity>(
    find: RootFilterQuery<Entity>,
    data: T,
    options?: IDatabaseUpdateOptions,
  ): Promise<EntityDocument | null> {
    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Data must be a non-empty object');
    }

    const now = new Date();

    const finalData = {
      $set: {
        ...data,
        updatedAt: now,
        updatedBy: options?.actionBy,
      },
    };

    return this._repository.findOneAndUpdate(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      finalData,
      {
        ...options,
        new: true,
      },
    );
  }

  /**
   * Update a single document using a raw MongoDB update query.
   */
  async updateRaw(
    find: RootFilterQuery<Entity>,
    data: UpdateQuery<Entity>,
    options?: IDatabaseUpdateOptions,
  ): Promise<EntityDocument | null> {
    if (Array.isArray(data)) {
      // Validate data structure
      const hasInvalidOperation = data.some(
        (operation) =>
          !operation ||
          typeof operation !== 'object' ||
          Object.keys(operation).length === 0,
      );

      if (hasInvalidOperation) {
        throw new Error('Data contains invalid operations');
      }
    } else {
      throw new Error('Data must be an array');
    }

    const now = new Date();

    // Handle array data update
    const setIndexOf = data.findLastIndex((e) => e['$set']);
    if (setIndexOf > -1) {
      data[setIndexOf]['$set'].updatedAt = now;
      data[setIndexOf]['$set'].updatedBy = options?.actionBy;
    } else {
      data.push({
        $set: {
          updatedAt: now,
          updatedBy: options?.actionBy,
        },
      });
    }

    return this._repository.findOneAndUpdate(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      data,
      {
        ...options,
        new: true,
      },
    );
  }

  /**
   * Update a document or insert it if it doesn't exist.
   */
  async upsert(
    find: RootFilterQuery<Entity>,
    data: UpdateQuery<Entity>,
    options?: IDatabaseUpsertOptions,
  ): Promise<EntityDocument> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Data must be a non-empty object');
    }

    const now = new Date();

    data['$set'] = {
      ...data['$set'],
      updatedAt: now,
      updatedBy: options?.actionBy,
    };

    // For new documents
    if (!data['$setOnInsert']) {
      data['$setOnInsert'] = {
        createdAt: now,
        createdBy: options?.actionBy,
      };
    } else {
      data['$setOnInsert'] = {
        ...data['$setOnInsert'],
        createdAt: now,
        createdBy: options?.actionBy,
      };
    }

    return this._repository.findOneAndUpdate(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      data,
      {
        ...options,
        new: true,
        upsert: true,
        timestamps: true,
      },
    );
  }

  /**
   * Delete a single document (hard delete).
   */
  async delete(
    find: RootFilterQuery<Entity>,
    options?: IDatabaseDeleteOptions,
  ): Promise<EntityDocument> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    return (await this._repository.findOneAndDelete(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      {
        ...options,
        new: false,
      },
    )) as unknown as EntityDocument;
  }

  /**
   * Save a document instance (create or update).
   */
  async save(
    repository: EntityDocument,
    options?: IDatabaseSaveOptions,
  ): Promise<EntityDocument> {
    if (!repository || !(repository instanceof Document)) {
      throw new Error('Repository must be a valid document');
    }

    if (repository.isNew) {
      const now = new Date();
      repository.createdAt = now;
      repository.updatedAt = now;
      repository.createdBy = options?.actionBy;
    } else {
      repository.updatedAt = new Date();
      repository.updatedBy = options?.actionBy;
    }

    return repository.save(options);
  }

  /**
   * Populate references in a document.
   */
  async join<T>(
    repository: EntityDocument,
    joins: PopulateOptions | (string | PopulateOptions)[],
  ): Promise<T> {
    if (!repository || !(repository instanceof Document)) {
      throw new Error('Repository must be a valid document');
    }

    if (!joins || (Array.isArray(joins) && joins.length === 0)) {
      throw new Error('Joins must be valid population options');
    }

    return repository.populate<T>(joins);
  }

  // Soft delete
  /**
   * Soft delete a document (set deletedAt).
   */
  async softDelete(
    repository: EntityDocument,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<EntityDocument> {
    if (!repository || !(repository instanceof Document)) {
      throw new Error('Repository must be a valid document');
    }

    repository.deletedAt = new Date();
    repository.deletedBy = options?.actionBy;

    return repository.save(options);
  }

  /**
   * Restore a soft-deleted document.
   */
  async restore(
    repository: EntityDocument,
    options?: IDatabaseSaveOptions,
  ): Promise<EntityDocument> {
    if (!repository || !(repository instanceof Document)) {
      throw new Error('Repository must be a valid document');
    }

    repository.deletedAt = undefined;
    repository.deletedBy = undefined;
    repository.updatedAt = new Date();
    repository.updatedBy = options?.actionBy;

    return repository.save(options);
  }

  // Bulk
  /**
   * Create multiple documents efficiently.
   */
  async createMany<T extends Partial<Entity>>(
    data: T[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<InsertManyResult<Entity>> {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array');
    }

    // Validate data structure
    const hasInvalidItem = data.some(
      (item) =>
        !item || typeof item !== 'object' || Object.keys(item).length === 0,
    );

    if (hasInvalidItem) {
      throw new Error('Data contains invalid items');
    }

    const now = new Date();
    return this._repository.insertMany(
      data.map((e) => {
        return {
          ...e,
          createdAt: now,
          updatedAt: now,
          createdBy: options?.actionBy,
        } as unknown as Entity;
      }),
      {
        ...options,
        includeResultMetadata: true,
      },
    ) as unknown as Promise<InsertManyResult<Entity>>;
  }

  /**
   * Update multiple documents matching criteria.
   */
  async updateMany<T = Entity>(
    find: RootFilterQuery<Entity>,
    data: T,
    options?: IDatabaseUpdateManyOptions,
  ): Promise<CustomUpdateResult<Entity>> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('Data must be a non-empty object');
    }

    const result = await this._repository.updateMany(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      {
        $set: {
          ...(data as any),
          updatedAt: new Date(),
          updatedBy: options?.actionBy,
        },
      },
      { ...options },
    );

    return result as CustomUpdateResult<Entity>;
  }

  /**
   * Update multiple documents using raw MongoDB update queries.
   */
  async updateManyRaw(
    find: RootFilterQuery<Entity>,
    data: UpdateQuery<Entity>,
    options?: IDatabaseUpdateManyOptions,
  ): Promise<CustomUpdateResult<Entity>> {
    if (!find || typeof find !== 'object' || Object.keys(find).length === 0) {
      throw new Error('Find criteria must be a non-empty object');
    }

    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    // Validate data structure
    const hasInvalidOperation = data.some(
      (operation) =>
        !operation ||
        typeof operation !== 'object' ||
        Object.keys(operation).length === 0,
    );

    if (hasInvalidOperation) {
      throw new Error('Data contains invalid operations');
    }

    const setIndexOf = data.findLastIndex((e) => e['$set']);
    if (setIndexOf > -1) {
      data[setIndexOf]['$set'].updatedAt = new Date();
      data[setIndexOf]['$set'].updatedBy = options?.actionBy;
    } else {
      data.push({
        $set: {
          updatedAt: new Date(),
          updatedBy: options?.actionBy,
        },
      });
    }

    return this._repository.updateMany(
      {
        ...find,
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      data,
      { ...options },
    ) as Promise<CustomUpdateResult<Entity>>;
  }

  /**
   * Delete multiple documents (hard delete).
   */
  async deleteMany(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<DeleteResult> {
    // Allow find to be optional, but if provided it must be a valid object
    if (
      find !== undefined &&
      (typeof find !== 'object' || Object.keys(find).length === 0)
    ) {
      throw new Error('If provided, find criteria must be a non-empty object');
    }

    return this._repository.deleteMany(
      {
        ...(find || {}),
        ...(!options?.withDeleted && {
          deletedAt: null,
        }),
      },
      { ...options },
    );
  }

  /**
   * Soft delete multiple documents.
   */
  async softDeleteMany(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<CustomUpdateResult<Entity>> {
    // Allow find to be optional, but if provided it must be a valid object
    if (
      find !== undefined &&
      (typeof find !== 'object' || Object.keys(find).length === 0)
    ) {
      throw new Error('If provided, find criteria must be a non-empty object');
    }

    return this._repository.updateMany(
      {
        ...(find || {}),
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
          deletedBy: options?.actionBy,
        },
      },
      { ...options },
    ) as Promise<CustomUpdateResult<Entity>>;
  }

  /**
   * Restore multiple soft-deleted documents.
   */
  async restoreMany(
    find?: RootFilterQuery<Entity>,
    options?: IDatabaseSaveOptions,
  ): Promise<CustomUpdateResult<Entity>> {
    // Allow find to be optional, but if provided it must be a valid object
    if (
      find !== undefined &&
      (typeof find !== 'object' || Object.keys(find).length === 0)
    ) {
      throw new Error('If provided, find criteria must be a non-empty object');
    }

    return this._repository.updateMany(
      {
        ...(find || {}),
        deletedAt: { $ne: null },
      },
      {
        $set: {
          deletedAt: undefined,
          deletedBy: undefined,
          updatedAt: new Date(),
          updatedBy: options?.actionBy,
        },
      },
      { ...options },
    ) as Promise<CustomUpdateResult<Entity>>;
  }

  // Raw
  /**
   * Perform an aggregation pipeline.
   */
  async aggregate<AggregateResponse, AggregatePipeline extends PipelineStage>(
    pipelines: AggregatePipeline[],
    options?: IDatabaseAggregateOptions,
  ): Promise<AggregateResponse[]> {
    if (!Array.isArray(pipelines)) {
      throw new Error('Must in array');
    }

    const newPipelines: PipelineStage[] = [
      {
        $match: {
          ...(!options?.withDeleted && {
            deletedAt: null,
          }),
        },
      },
      ...pipelines,
    ];

    const aggregate =
      this._repository.aggregate<AggregateResponse>(newPipelines);

    if (options?.session) {
      aggregate.session(options?.session);
    }

    return aggregate;
  }

  /**
   * Perform an aggregation pipeline with pagination and sorting options.
   */
  async findAllAggregate<
    AggregateResponse,
    AggregatePipeline extends PipelineStage = PipelineStage,
  >(
    pipelines: AggregatePipeline[],
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<AggregateResponse[]> {
    if (!Array.isArray(pipelines)) {
      throw new Error('Must in array');
    }

    const newPipelines: PipelineStage[] = [
      {
        $match: {
          ...(!options?.withDeleted && {
            deletedAt: null,
          }),
        },
      },
      ...pipelines,
    ];

    if (options?.order) {
      const keysOrder = Object.keys(options?.order);
      newPipelines.push({
        $sort: keysOrder.reduce(
          (a, b) => ({
            ...a,
            [b]:
              options.order![b] === EnumPaginationOrderDirectionType.asc
                ? 1
                : -1,
          }),
          {},
        ),
      });
    }

    if (options?.paging) {
      newPipelines.push(
        { $skip: options.paging.offset },
        {
          $limit: options.paging.limit,
        },
      );
    }

    const aggregate =
      this._repository.aggregate<AggregateResponse>(newPipelines);

    if (options?.session) {
      aggregate.session(options?.session);
    }

    return aggregate;
  }

  /**
   * Get the total count of results from an aggregation pipeline.
   */
  async getTotalAggregate<AggregatePipeline extends PipelineStage>(
    pipelines: AggregatePipeline[],
    options?: IDatabaseAggregateOptions,
  ): Promise<number> {
    if (!Array.isArray(pipelines)) {
      throw new Error('Must in array');
    }

    const newPipelines: PipelineStage[] = [
      {
        $match: {
          ...(!options?.withDeleted && {
            deletedAt: null,
          }),
        },
      },
      ...pipelines,
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ];

    const aggregate = this._repository.aggregate(newPipelines);

    if (options?.session) {
      aggregate.session(options.session);
    }

    const raw = await aggregate;
    return raw && raw.length > 0 ? raw[0].count : 0;
  }

  /**
   * Get the underlying Mongoose model.
   */
  async model(): Promise<Model<Entity>> {
    return this._repository;
  }
}
