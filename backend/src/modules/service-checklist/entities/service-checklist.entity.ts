import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../enums/service-checklist.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const ServiceChecklistTableName = 'service_checklists';

@DatabaseEntity({ collection: ServiceChecklistTableName })
export class ServiceChecklistEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 250,
  })
  name: string;

  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 300,
  })
  code: string;

  @DatabaseProp({
    required: false,
    maxlength: 500,
    default: null,
    trim: true,
  })
  description?: string;

  @DatabaseProp({
    required: false,
    default: '0',
  })
  order?: string;

  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: ENUM_SERVICE_CHECKLIST_AREA,
  })
  area: ENUM_SERVICE_CHECKLIST_AREA;
}

export const ServiceChecklistSchema = DatabaseSchema(ServiceChecklistEntity);

export type ServiceChecklistDoc = IDatabaseDocument<ServiceChecklistEntity>;
