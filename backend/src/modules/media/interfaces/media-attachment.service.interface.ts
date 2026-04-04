import { MediaAttachmentModel } from '../models/media-attachment.model';
import { MediaAttachmentAttachRequestDto } from '../dtos/request/media-attachment.attach.request.dto';

/**
 * Interface for MediaAttachment service operations.
 * Defines the contract for attaching/detaching media to/from entities.
 */
export interface IMediaAttachmentService {
  /**
   * Attach a media file to an entity.
   */
  attachMedia(
    dto: MediaAttachmentAttachRequestDto,
    actionBy?: string
  ): Promise<MediaAttachmentModel>;

  /**
   * Detach (soft-delete) a specific attachment.
   */
  detachMedia(attachmentId: string, actionBy?: string): Promise<void>;

  /**
   * Get all media attachments for a specific entity.
   * Optionally filter by purpose.
   */
  getMediaForEntity(
    attachableType: string,
    attachableId: string,
    purpose?: string
  ): Promise<MediaAttachmentModel[]>;

  /**
   * Get all entities that are using a specific media file.
   */
  getUsages(mediaId: string): Promise<MediaAttachmentModel[]>;

  /**
   * Replace media for an entity+purpose combination.
   * Soft-deletes existing attachment(s) and creates a new one.
   */
  replaceMedia(
    attachableType: string,
    attachableId: string,
    purpose: string,
    newMediaId: string,
    actionBy?: string
  ): Promise<MediaAttachmentModel>;

  /**
   * Reorder attachments by providing an ordered list of attachment IDs.
   */
  reorderMedia(orderedIds: string[]): Promise<void>;

  /**
   * Detach all media from a specific entity (optionally filtered by purpose).
   */
  detachAllMedia(
    attachableType: string,
    attachableId: string,
    purpose?: string,
    actionBy?: string
  ): Promise<number>;
}
