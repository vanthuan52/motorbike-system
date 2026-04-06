import { CareRecordMediaModel } from '../models/care-record-media.model';
import { EnumCareRecordMediaStage } from '../enums/care-record-media.enum';
import { CareRecordMapper } from '@/modules/care-record/mappers/care-record.mapper';
import { EnumMediaFileType } from '@/modules/media/enums/media.enum';
import { CareRecordMedia as PrismaCareRecordMedia } from '@/generated/prisma-client';

type PrismaCareRecordMediaWithRelations = PrismaCareRecordMedia & {
  careRecord?: any;
};

export class CareRecordMediaMapper {
  static toDomain(
    prismaMedia: PrismaCareRecordMediaWithRelations
  ): CareRecordMediaModel {
    const model = new CareRecordMediaModel();
    model.id = prismaMedia.id;
    model.cdnUrl = prismaMedia.cdnUrl ?? undefined;
    model.description = prismaMedia.description ?? undefined;
    model.stage = prismaMedia.stage as EnumCareRecordMediaStage;
    model.type = prismaMedia.type as EnumMediaFileType;
    model.careRecordId = prismaMedia.careRecordId;

    model.createdAt = prismaMedia.createdAt;
    model.updatedAt = prismaMedia.updatedAt;
    model.deletedAt = prismaMedia.deletedAt ?? undefined;
    model.createdBy = prismaMedia.createdBy ?? undefined;
    model.updatedBy = prismaMedia.updatedBy ?? undefined;
    model.deletedBy = prismaMedia.deletedBy ?? undefined;

    if (prismaMedia.careRecord) {
      model.careRecord = CareRecordMapper.toDomain(prismaMedia.careRecord);
    }

    return model;
  }
}
