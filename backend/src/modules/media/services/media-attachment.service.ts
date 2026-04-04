import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaAttachmentRepository } from '../repositories/media-attachment.repository';
import { MediaRepository } from '../repositories/media.repository';
import { IMediaAttachmentService } from '../interfaces/media-attachment.service.interface';
import { MediaAttachmentAttachRequestDto } from '../dtos/request/media-attachment.attach.request.dto';
import { MediaAttachmentModel } from '../models/media-attachment.model';
import { EnumMediaAttachmentPurpose } from '../enums/media-attachment.enum';

/**
 * Service handling all media-to-entity attachment operations.
 *
 * This is the main entry point for any module that needs to
 * attach, detach, query, or reorder media files on entities.
 *
 * @example
 * // Attach an avatar to a user
 * await mediaAttachmentService.attachMedia({
 *   attachableType: 'User',
 *   attachableId: userId,
 *   mediaId: uploadedMedia.id,
 *   purpose: 'avatar',
 * });
 *
 * // Get all "before" photos of a CareRecord
 * const photos = await mediaAttachmentService.getMediaForEntity(
 *   'CareRecord', careRecordId, 'before'
 * );
 */
@Injectable()
export class MediaAttachmentService implements IMediaAttachmentService {
  constructor(
    private readonly mediaAttachmentRepository: MediaAttachmentRepository,
    private readonly mediaRepository: MediaRepository
  ) {}

  /**
   * Attach a media file to an entity.
   * Validates that the media file exists before creating the attachment.
   */
  async attachMedia(
    dto: MediaAttachmentAttachRequestDto,
    actionBy?: string
  ): Promise<MediaAttachmentModel> {
    // Validate media exists
    const media = await this.mediaRepository.findOneById(dto.mediaId);
    if (!media) {
      throw new NotFoundException({
        message: 'media.error.notFound',
      });
    }

    return this.mediaAttachmentRepository.create({
      attachableType: dto.attachableType,
      attachableId: dto.attachableId,
      media: { connect: { id: dto.mediaId } },
      purpose: dto.purpose || EnumMediaAttachmentPurpose.default,
      caption: dto.caption,
      orderBy: dto.orderBy ?? 0,
      createdBy: actionBy,
    });
  }

  /**
   * Soft-delete a specific attachment by ID.
   */
  async detachMedia(attachmentId: string, actionBy?: string): Promise<void> {
    const attachment =
      await this.mediaAttachmentRepository.findOneById(attachmentId);

    if (!attachment) {
      throw new NotFoundException({
        message: 'media-attachment.error.notFound',
      });
    }

    await this.mediaAttachmentRepository.softDelete(attachmentId, actionBy);
  }

  /**
   * Get all active media attachments for a specific entity.
   * Optionally filter by purpose (e.g. only "avatar", only "gallery").
   */
  async getMediaForEntity(
    attachableType: string,
    attachableId: string,
    purpose?: string
  ): Promise<MediaAttachmentModel[]> {
    return this.mediaAttachmentRepository.findByAttachable(
      attachableType,
      attachableId,
      purpose
    );
  }

  /**
   * Find all entities currently using a specific media file.
   * Useful for checking references before deleting a media file.
   */
  async getUsages(mediaId: string): Promise<MediaAttachmentModel[]> {
    return this.mediaAttachmentRepository.findByMediaId(mediaId);
  }

  /**
   * Replace the media for a specific entity+purpose.
   * Soft-deletes all existing attachments with the same purpose,
   * then creates a new attachment.
   *
   * @example
   * // Change user's avatar
   * await mediaAttachmentService.replaceMedia('User', userId, 'avatar', newMediaId);
   */
  async replaceMedia(
    attachableType: string,
    attachableId: string,
    purpose: string,
    newMediaId: string,
    actionBy?: string
  ): Promise<MediaAttachmentModel> {
    // Validate new media exists
    const media = await this.mediaRepository.findOneById(newMediaId);
    if (!media) {
      throw new NotFoundException({
        message: 'media.error.notFound',
      });
    }

    // Soft-delete existing attachments for this entity+purpose
    await this.mediaAttachmentRepository.softDeleteByAttachable(
      attachableType,
      attachableId,
      purpose,
      actionBy
    );

    // Create new attachment
    return this.mediaAttachmentRepository.create({
      attachableType,
      attachableId,
      media: { connect: { id: newMediaId } },
      purpose,
      createdBy: actionBy,
    });
  }

  /**
   * Reorder attachments by providing an ordered list of attachment IDs.
   * The order in the array determines the `orderBy` value (0, 1, 2...).
   */
  async reorderMedia(orderedIds: string[]): Promise<void> {
    const orderedItems = orderedIds.map((id, index) => ({
      id,
      orderBy: index,
    }));

    await this.mediaAttachmentRepository.reorder(orderedItems);
  }

  /**
   * Soft-delete all media attachments for an entity.
   * Optionally filter by purpose.
   *
   * @returns Number of attachments removed.
   */
  async detachAllMedia(
    attachableType: string,
    attachableId: string,
    purpose?: string,
    actionBy?: string
  ): Promise<number> {
    return this.mediaAttachmentRepository.softDeleteByAttachable(
      attachableType,
      attachableId,
      purpose,
      actionBy
    );
  }
}
