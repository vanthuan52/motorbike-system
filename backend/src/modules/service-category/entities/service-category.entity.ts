import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { EnumServiceCategoryStatus } from '../enums/service-category.enum';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const ServiceCategoryTableName = 'service_categories';

@DatabaseEntity({ collection: ServiceCategoryTableName })
export class ServiceCategoryEntity extends DatabaseEntityBase {
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
  orderBy?: string;

  @DatabaseProp({
    required: true,
    default: EnumServiceCategoryStatus.active,
    index: true,
    type: String,
    enum: EnumServiceCategoryStatus,
  })
  status: EnumServiceCategoryStatus;
}

export const ServiceCategorySchema = DatabaseSchema(ServiceCategoryEntity);

export type ServiceCategoryDoc = IDatabaseDocument<ServiceCategoryEntity>;
