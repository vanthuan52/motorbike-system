import { MediaModel } from '../models/media.model';
import {
  EnumMediaType,
  EnumMediaPurpose,
  EnumMediaAccessibility,
  EnumMediaStatus,
} from '../enums/media.enum';
import { Media as PrismaMedia } from '@/generated/prisma-client';

export class MediaMapper {
  static toDomain(prismaMedia: PrismaMedia): MediaModel {
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
    model.type = prismaMedia.type as EnumMediaType;
    model.purpose = prismaMedia.purpose as EnumMediaPurpose;
    model.status = prismaMedia.status as EnumMediaStatus;
    model.accessibility = prismaMedia.accessibility as EnumMediaAccessibility;
    model.metadata = prismaMedia.metadata as Record<string, any> | undefined;

    model.createdAt = prismaMedia.createdAt;
    model.updatedAt = prismaMedia.updatedAt;
    model.deletedAt = prismaMedia.deletedAt;
    model.createdBy = prismaMedia.createdBy;
    model.updatedBy = prismaMedia.updatedBy;
    model.deletedBy = prismaMedia.deletedBy;

    return model;
  }
}
