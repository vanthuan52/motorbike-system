import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';
import { ENUM_CARE_RECORD_MEDIA_STAGE } from '../enums/care-record-media.enum';
import { CareRecordEntity } from '@/modules/care-record/entities/care-record.entity';
import { ENUM_FILE_MIME } from '@/common/file/enums/file.enum';

export const CareRecordMediaTableName = 'care_record_medias';

@DatabaseEntity({
  collection: CareRecordMediaTableName,
})
export class CareRecordMediaEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    ref: () => CareRecordEntity.name,
  })
  careRecord: string;

  @DatabaseProp({
    required: false,
  })
  url?: string;

  @DatabaseProp({
    required: false,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_CARE_RECORD_MEDIA_STAGE,
  })
  stage: ENUM_CARE_RECORD_MEDIA_STAGE;

  @DatabaseProp({
    required: true,
    type: String,
    enum: ENUM_FILE_MIME,
  })
  type: ENUM_FILE_MIME;
}

export const CareRecordMediaSchema = DatabaseSchema(CareRecordMediaEntity);

export type CareRecordMediaDoc = IDatabaseDocument<CareRecordMediaEntity>;
