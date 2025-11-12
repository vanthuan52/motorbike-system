import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const CareAreaTableName = 'care_areas';

@DatabaseEntity({ collection: CareAreaTableName })
export class CareAreaEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 250,
  })
  name: string;

  @DatabaseProp({
    required: false,
    default: null,
  })
  description?: string;

  @DatabaseProp({
    required: false,
    default: '0',
  })
  order?: string; // Display order
}

export const CareAreaSchema = DatabaseSchema(CareAreaEntity);

export type CareAreaDoc = IDatabaseDocument<CareAreaEntity>;
