import { MediaAttachmentModel } from '../models/media-attachment.model';
import { MediaMapper } from './media.mapper';
import { MediaAttachment as PrismaMediaAttachment } from '@/generated/prisma-client';

/**
 * Maps Prisma MediaAttachment entity to domain model and vice-versa.
 */
export class MediaAttachmentMapper {
  static toDomain(prismaEntity: PrismaMediaAttachment): MediaAttachmentModel {
    const model = new MediaAttachmentModel();
    model.id = prismaEntity.id;
    model.attachableType = prismaEntity.attachableType;
    model.attachableId = prismaEntity.attachableId;
    model.mediaId = prismaEntity.mediaId;
    model.purpose = prismaEntity.purpose;
    model.caption = prismaEntity.caption ?? undefined;
    model.orderBy = prismaEntity.orderBy;

    model.createdAt = prismaEntity.createdAt;
    model.updatedAt = prismaEntity.updatedAt;
    model.deletedAt = prismaEntity.deletedAt ?? undefined;
    model.createdBy = prismaEntity.createdBy ?? undefined;
    model.updatedBy = prismaEntity.updatedBy ?? undefined;
    model.deletedBy = prismaEntity.deletedBy ?? undefined;

    // Map nested media if included
    if (prismaEntity.media) {
      model.media = MediaMapper.toDomain(prismaEntity.media);
    }

    return model;
  }
}
