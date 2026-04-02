import { CareRecordMediaModel } from '../models/care-record-media.model';
import { EnumCareRecordMediaStage, EnumMediaFileType } from '../enums/care-record-media.enum';
import { CareRecordMapper } from '@/modules/care-record/mappers/care-record.mapper';

export class CareRecordMediaMapper {
  static toDomain(prismaMedia: any): CareRecordMediaModel {
    const model = new CareRecordMediaModel();
    model.id = prismaMedia.id;
    model.url = prismaMedia.url;
    model.description = prismaMedia.description;
    model.stage = prismaMedia.stage?.toLowerCase() as EnumCareRecordMediaStage;
    model.type = prismaMedia.type?.toLowerCase() as EnumMediaFileType;
    model.careRecordId = prismaMedia.careRecordId;

    model.createdAt = prismaMedia.createdAt;
    model.updatedAt = prismaMedia.updatedAt;
    model.deletedAt = prismaMedia.deletedAt;
    model.createdBy = prismaMedia.createdBy;
    model.updatedBy = prismaMedia.updatedBy;
    model.deletedBy = prismaMedia.deletedBy;

    if (prismaMedia.careRecord) {
      model.careRecord = CareRecordMapper.toDomain(prismaMedia.careRecord);
    }

    return model;
  }
}
