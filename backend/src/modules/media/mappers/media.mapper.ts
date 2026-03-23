import { MediaModel } from '../models/media.model';
import { EnumMediaType, EnumMediaPurpose, EnumMediaAccessibility } from '../enums/media.enum';
import { EnumUserStatus as EnumStatus } from '@/modules/user/enums/user.enum';

export class MediaMapper {
  static toDomain(prismaMedia: any): MediaModel {
    const model = new MediaModel();
    model.id = prismaMedia.id;
    model.key = prismaMedia.key;
    model.filename = prismaMedia.filename;
    model.mimeType = prismaMedia.mimeType;
    model.size = prismaMedia.size;
    model.extension = prismaMedia.extension;
    model.bucket = prismaMedia.bucket;
    model.cdnUrl = prismaMedia.cdnUrl;
    model.completedUrl = prismaMedia.completedUrl;
    model.type = prismaMedia.type?.toLowerCase() as EnumMediaType;
    const purposeMap: Record<string, EnumMediaPurpose> = {
      PROFILE_PHOTO: EnumMediaPurpose.profilePhoto,
      CARE_RECORD: EnumMediaPurpose.careRecord,
      CARE_RECORD_MEDIA: EnumMediaPurpose.careRecordMedia,
      VEHICLE: EnumMediaPurpose.vehicle,
      VEHICLE_BRAND: EnumMediaPurpose.vehicleBrand,
      CHAT_ATTACHMENT: EnumMediaPurpose.chatAttachment,
      STORE: EnumMediaPurpose.store,
      GENERAL: EnumMediaPurpose.general,
    };
    model.purpose = purposeMap[prismaMedia.purpose] || EnumMediaPurpose.general;
    model.status = prismaMedia.status?.toLowerCase() as EnumStatus;
    model.accessibility = prismaMedia.accessibility?.toLowerCase() as EnumMediaAccessibility;

    model.createdAt = prismaMedia.createdAt;
    model.updatedAt = prismaMedia.updatedAt;
    model.deletedAt = prismaMedia.deletedAt;
    model.createdBy = prismaMedia.createdBy;
    model.updatedBy = prismaMedia.updatedBy;
    model.deletedBy = prismaMedia.deletedBy;

    return model;
  }
}
