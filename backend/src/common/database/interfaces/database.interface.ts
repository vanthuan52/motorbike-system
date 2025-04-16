import { ClientSession, Document, PopulateOptions } from 'mongoose';
import { IPaginationOrder } from '@/common/pagination/interfaces/pagination.interface';

export interface IDatabaseQueryContainOptions {
  fullWord: boolean;
}

export type IDatabaseDocument<T> = T & Document;

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
  order?: IPaginationOrder;
}

export type IDatabaseGetTotalOptions = Omit<IDatabaseOptions, 'select'>;

export interface IDatabaseFindAllPagingOptions {
  limit: number;
  offset: number;
}

export interface IDatabaseFindAllOptions extends IDatabaseFindOneOptions {
  paging?: IDatabaseFindAllPagingOptions;
}
