export type BaseEntity = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  __v?: number;
};

export enum ENUM_ORDER_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}

export type PaginationOrder = {
  orderBy?: string;
  orderDirection?: ENUM_ORDER_DIRECTION;
};

export interface PaginationQuery extends PaginationOrder {
  search?: string;
  page: number;
  perPage: number;
}
