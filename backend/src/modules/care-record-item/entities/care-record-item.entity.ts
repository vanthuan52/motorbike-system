import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import {
  ENUM_CARE_RECORD_ITEM_SOURCE,
  ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
} from '../enums/care-record-item.enum';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { PartEntity } from '@/modules/part/entities/part.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';

export const CareRecordItemTableName = 'care_record_items';

@DatabaseEntity({
  collection: CareRecordItemTableName,
})
export class CareRecordItemEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordItemEntity.name,
  })
  careRecord: string;

  @DatabaseProp({
    required: true,
    ref: () => VehicleServiceEntity.name,
  })
  vehicleService: string;

  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_ITEM_SOURCE,
  })
  source: ENUM_CARE_RECORD_ITEM_SOURCE;

  @DatabaseProp({
    required: true,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_ITEM_ITEM_TYPE,
  })
  itemType: ENUM_CARE_RECORD_ITEM_ITEM_TYPE;

  @DatabaseProp({
    required: false,
    maxlength: 250,
  })
  name: string;

  @DatabaseProp({
    required: false,
    ref: () => PartEntity.name,
  })
  part?: string;

  @DatabaseProp({
    required: true,
    min: 1,
  })
  quantity: number;

  @DatabaseProp({
    required: true,
  })
  unitPrice: number;

  @DatabaseProp({
    required: true,
  })
  totalPrice: number;

  @DatabaseProp({
    required: false,
    ref: () => UserEntity.name,
  })
  technician?: string;

  @DatabaseProp({
    required: false,
    type: Boolean,
    default: false,
  })
  approvedByOwner?: boolean;

  @DatabaseProp({
    required: false,
    maxlength: 500,
  })
  note?: string;
}

export const CareRecordItemSchema = DatabaseSchema(CareRecordItemEntity);

export type CareRecordItemDoc = IDatabaseDocument<CareRecordItemEntity>;
