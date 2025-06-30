import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import { ENUM_SERVICE_CATEGORY_STATUS } from '../enums/service-category.enum';
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
  order?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_SERVICE_CATEGORY_STATUS.ACTIVE,
    index: true,
    type: String,
    enum: ENUM_SERVICE_CATEGORY_STATUS,
  })
  status: ENUM_SERVICE_CATEGORY_STATUS;
}

export const ServiceCategorySchema = DatabaseSchema(ServiceCategoryEntity);

export type ServiceCategoryDoc = IDatabaseDocument<ServiceCategoryEntity>;
