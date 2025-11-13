import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import {
  ENUM_CARE_RECORD_SERVICE_STATUS,
  ENUM_CARE_RECORD_SERVICE_TYPE,
} from '../enums/care-record-service.enum';
import { VehicleServiceEntity } from '@/modules/vehicle-service/entities/vehicle-service.entity';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';

export const CareRecordServiceTableName = 'care_record_services';

@DatabaseEntity({
  collection: CareRecordServiceTableName,
})
export class CareRecordServiceEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordEntity.name,
  })
  careRecord: string;

  @DatabaseProp({
    required: true,
    type: String,
    trim: true,
  })
  name: string;

  @DatabaseProp({
    required: false,
    ref: () => VehicleServiceEntity.name,
  })
  vehicleService?: string;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_SERVICE_STATUS.PENDING,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_SERVICE_STATUS,
  })
  status: ENUM_CARE_RECORD_SERVICE_STATUS;

  @DatabaseProp({
    required: true,
    default: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE,
    index: true,
    type: String,
    enum: ENUM_CARE_RECORD_SERVICE_TYPE,
  })
  type: ENUM_CARE_RECORD_SERVICE_TYPE;
}

export const CareRecordServiceSchema = DatabaseSchema(CareRecordServiceEntity);

export type CareRecordServiceDoc = IDatabaseDocument<CareRecordServiceEntity>;
