import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { MediaAttachmentModel } from '../models/media-attachment.model';
import { MediaAttachmentMapper } from '../mappers/media-attachment.mapper';
import {
  Prisma,
  Attachment as PrismaAttachment,
} from '@/generated/prisma-client';

@Injectable()
export class MediaAttachmentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Find all media attachments for a specific entity.
   * Always includes the nested `media` relation.
   */
  async findByAttachable(
    attachableType: string,
    attachableId: string,
    purpose?: string
  ): Promise<MediaAttachmentModel[]> {
    const where: Prisma.MediaAttachmentWhereInput = {
      attachableType,
      attachableId,
      deletedAt: null,
    };

    if (purpose) {
      where.purpose = purpose;
    }

    const results = await this.databaseService.mediaAttachment.findMany({
      where,
      include: { media: true },
      orderBy: { orderBy: 'asc' },
    });

    return results.map((item: PrismaAttachment) =>
      MediaAttachmentMapper.toDomain(item)
    );
  }

  /**
   * Find a single attachment by its ID.
   */
  async findOneById(id: string): Promise<MediaAttachmentModel | null> {
    const result = await this.databaseService.mediaAttachment.findUnique({
      where: { id },
      include: { media: true },
    });

    return result ? MediaAttachmentMapper.toDomain(result) : null;
  }

  /**
   * Find all entities that are using a specific media file.
   */
  async findByMediaId(mediaId: string): Promise<MediaAttachmentModel[]> {
    const results = await this.databaseService.mediaAttachment.findMany({
      where: { mediaId, deletedAt: null },
      include: { media: true },
    });

    return results.map((item: PrismaAttachment) =>
      MediaAttachmentMapper.toDomain(item)
    );
  }

  /**
   * Create a new media attachment (link media to entity).
   */
  async create(
    data: Prisma.MediaAttachmentCreateInput
  ): Promise<MediaAttachmentModel> {
    const result = await this.databaseService.mediaAttachment.create({
      data,
      include: { media: true },
    });

    return MediaAttachmentMapper.toDomain(result);
  }

  /**
   * Update an existing attachment (e.g. caption, orderBy).
   */
  async update(
    id: string,
    data: Prisma.MediaAttachmentUpdateInput
  ): Promise<MediaAttachmentModel> {
    const result = await this.databaseService.mediaAttachment.update({
      where: { id },
      data,
      include: { media: true },
    });

    return MediaAttachmentMapper.toDomain(result);
  }

  /**
   * Soft-delete an attachment.
   */
  async softDelete(
    id: string,
    actionBy?: string
  ): Promise<MediaAttachmentModel> {
    return this.update(id, {
      deletedAt: new Date(),
      deletedBy: actionBy,
    });
  }

  /**
   * Soft-delete all attachments for a specific entity + optional purpose filter.
   */
  async softDeleteByAttachable(
    attachableType: string,
    attachableId: string,
    purpose?: string,
    actionBy?: string
  ): Promise<number> {
    const where: Prisma.MediaAttachmentWhereInput = {
      attachableType,
      attachableId,
      deletedAt: null,
    };

    if (purpose) {
      where.purpose = purpose;
    }

    const result = await this.databaseService.mediaAttachment.updateMany({
      where,
      data: {
        deletedAt: new Date(),
        deletedBy: actionBy,
      },
    });

    return result.count;
  }

  /**
   * Batch update orderBy for reordering attachments.
   */
  async reorder(orderedIds: { id: string; orderBy: number }[]): Promise<void> {
    const operations = orderedIds.map(({ id, orderBy }) =>
      this.databaseService.mediaAttachment.update({
        where: { id },
        data: { orderBy },
      })
    );

    await this.databaseService.$transaction(operations);
  }

  /**
   * Count attachments for a specific entity.
   */
  async countByAttachable(
    attachableType: string,
    attachableId: string,
    purpose?: string
  ): Promise<number> {
    const where: Prisma.MediaAttachmentWhereInput = {
      attachableType,
      attachableId,
      deletedAt: null,
    };

    if (purpose) {
      where.purpose = purpose;
    }

    return this.databaseService.mediaAttachment.count({ where });
  }
}
