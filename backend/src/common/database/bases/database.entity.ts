import { v4 as uuidV4 } from 'uuid';
import { DatabaseProp } from '../decorators/database.decorator';
import { Prop } from '@nestjs/mongoose';

export class DatabaseEntityBase {
  @Prop({
    type: String,
    default: () => uuidV4(),
  })
  _id: string;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
    default: () => new Date(),
  })
  createdAt?: Date;

  @Prop({
    required: false,
    index: 'asc',
    type: Date,
    default: new Date(),
  })
  updatedAt?: Date;
}
