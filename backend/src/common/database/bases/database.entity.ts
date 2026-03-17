import { DatabaseDefaultUUID } from '../constants/database.function.constant';
import { DatabaseBaseEntityAbstract } from './abstract/database.entity.abstract';
import { DatabaseProp } from '../decorators/database.decorator';

export class DatabaseEntityBase extends DatabaseBaseEntityAbstract {
  @DatabaseProp({
    type: String,
    required: true,
    default: DatabaseDefaultUUID,
  })
  _id: string;
}
