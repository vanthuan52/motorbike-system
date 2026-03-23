import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { CareAreaEntity } from '@/modules/care-area/entities/care-area.entity';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';

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
    unique: true,
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
  orderBy?: string;

  @DatabaseProp({
    required: true,
    ref: () => CareAreaEntity.name,
    index: true,
  })
  careArea: string;

  @DatabaseProp({
    required: false,
    type: [String],
    enum: Object.values(EnumVehicleModelType),
    default: [],
  })
  vehicleType?: EnumVehicleModelType[];
}

export const ServiceChecklistSchema = DatabaseSchema(ServiceChecklistEntity);

export type ServiceChecklistDoc = IDatabaseDocument<ServiceChecklistEntity>;
