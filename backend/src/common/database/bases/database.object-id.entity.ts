import { Types } from 'mongoose';
import { DatabaseProp } from '../decorators/database.decorator';
import { DatabaseBaseEntityAbstract } from './database.entity.abstract';
import { DatabaseDefaultObjectId } from '../constants/database.function.constant';

export class DatabaseObjectIdEntityBase extends DatabaseBaseEntityAbstract {
  @DatabaseProp({
    type: Types.ObjectId,
    required: true,
    default: DatabaseDefaultObjectId,
  })
  _id: Types.ObjectId;

  @DatabaseProp({
    required: false,
    index: 'asc',
    type: Date,
    default: () => new Date(),
  })
  createdAt?: Date;

  @DatabaseProp({
    required: false,
    index: 'asc',
    type: Date,
    default: () => new Date(),
  })
  updatedAt?: Date;

  @DatabaseProp({
    required: false,
    index: true,
    type: Date,
  })
  deletedAt?: Date;

  @DatabaseProp({
    required: false,
    index: true,
  })
  createdBy?: string;

  @DatabaseProp({
    required: false,
    index: true,
  })
  updatedBy?: string;

  @DatabaseProp({
    required: false,
    index: true,
  })
  deletedBy?: string;

  @DatabaseProp({
    required: true,
    index: true,
    default: false,
  })
  deleted: boolean;

  @DatabaseProp({
    type: Number,
    default: 0,
    required: true,
    index: true,
    description:
      'Document version for optimistic concurrency control by Mongoose',
  })
  __v: number;
}
