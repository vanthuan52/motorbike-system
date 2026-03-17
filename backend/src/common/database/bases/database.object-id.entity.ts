import { Types } from 'mongoose';
import { DatabaseProp } from '../decorators/database.decorator';
import { DatabaseBaseEntityAbstract } from './abstract/database.entity.abstract';
import { DatabaseDefaultObjectId } from '../constants/database.function.constant';

export class DatabaseObjectIdEntityBase extends DatabaseBaseEntityAbstract {
  @DatabaseProp({
    type: Types.ObjectId,
    required: true,
    default: DatabaseDefaultObjectId,
  })
  _id: Types.ObjectId;
}
