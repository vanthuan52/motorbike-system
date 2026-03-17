import { ClientSession, HydratedDocument, PopulateOptions } from 'mongoose';
import { IPaginationOrderBy } from '@/common/pagination/interfaces/pagination.interface';

export interface IDatabaseQueryContainOptions {
  fullWord: boolean;
}

export type IDatabaseDocument<T> = HydratedDocument<T>;

// Find
export interface IDatabaseOptions {
  select?: Record<string, boolean | number> | string;
  join?: boolean | PopulateOptions | PopulateOptions[];
  session?: ClientSession;
  withDeleted?: boolean;
}

export interface IDatabaseExistsOptions extends IDatabaseOptions {
  excludeId?: string;
}

export interface IDatabaseFindOneOptions extends IDatabaseOptions {
  order?: IPaginationOrderBy;
}

export type IDatabaseGetTotalOptions = Omit<IDatabaseOptions, 'select'>;

export interface IDatabaseFindAllPagingOptions {
  limit: number;
  offset: number;
}

export interface IDatabaseFindAllCursorOptions {
  limit: number;
  order: IPaginationOrderBy;
  cursorField: string;
  cursor?: string;
}

export interface IDatabaseFindAllOptions extends IDatabaseFindOneOptions {
  paging?: IDatabaseFindAllPagingOptions;
  cursor?: IDatabaseFindAllCursorOptions;
}

// Action
type IDatabaseActionByOptions = {
  actionBy: string;
};

export type IDatabaseCreateOptions = Pick<IDatabaseOptions, 'session'> &
  IDatabaseActionByOptions;
export type IDatabaseUpdateOptions = Omit<IDatabaseOptions, 'select' | 'join'> &
  IDatabaseActionByOptions;
export type IDatabaseUpsertOptions = Omit<IDatabaseOptions, 'select' | 'join'> &
  IDatabaseActionByOptions;
export type IDatabaseDeleteOptions = Omit<IDatabaseOptions, 'select' | 'join'> &
  IDatabaseActionByOptions;
export type IDatabaseSaveOptions = Pick<IDatabaseOptions, 'session'> &
  IDatabaseActionByOptions;
export type IDatabaseSoftDeleteOptions = IDatabaseOptions &
  IDatabaseActionByOptions;

// Bulk
export type IDatabaseCreateManyOptions = Pick<IDatabaseOptions, 'session'> &
  IDatabaseActionByOptions;
export interface IDatabaseUpdateManyOptions
  extends
    Pick<IDatabaseOptions, 'session' | 'withDeleted'>,
    IDatabaseActionByOptions {
  upsert?: boolean;
}

export type IDatabaseDeleteManyOptions = Pick<
  IDatabaseOptions,
  'session' | 'withDeleted'
> &
  IDatabaseActionByOptions;

// Raw
export type IDatabaseAggregateOptions = Pick<
  IDatabaseOptions,
  'session' | 'withDeleted'
>;

export type IDatabaseFindAllAggregateOptions = Omit<
  IDatabaseFindAllOptions,
  'join' | 'select'
>;
