export type BaseEntity = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
};
