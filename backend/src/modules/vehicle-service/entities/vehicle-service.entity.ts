import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_VEHICLE_SERVICE_STATUS } from '../enums/vehicle-service.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ServiceCategoryEntity } from '@/modules/service-category/entities/service-category.entity';
import { ServiceChecklistEntity } from '@/modules/service-checklist/entities/service-checklist.entity';

export const VehicleServiceTableName = 'vehicle_services';

@DatabaseEntity({ collection: VehicleServiceTableName })
export class VehicleServiceEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @DatabaseProp({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
  })
  slug: string;

  @DatabaseProp({
    required: false,
    maxlength: 255,
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
    default: ENUM_VEHICLE_SERVICE_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_VEHICLE_SERVICE_STATUS,
  })
  status: ENUM_VEHICLE_SERVICE_STATUS;

  @DatabaseProp({
    required: true,
    ref: () => ServiceCategoryEntity.name,
    index: true,
    trim: true,
  })
  serviceCategory: string;

  @DatabaseProp({
    required: false,
    default: null,
    trim: true,
  })
  photo?: string;

  @DatabaseProp({
    type: [String],
    ref: () => ServiceChecklistEntity.name,
    default: [],
  })
  checklistItems: string[];
}

export const VehicleServiceSchema = DatabaseSchema(VehicleServiceEntity);

export type VehicleServiceDoc = IDatabaseDocument<VehicleServiceEntity>;
