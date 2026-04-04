import { MediaModel } from './media.model';

/**
 * Domain model representing a link between a Media file and any entity in the system.
 * Uses polymorphic pattern: `attachableType` + `attachableId` identify the owning entity.
 */
export class MediaAttachmentModel {
  id: string;
  attachableType: string;
  attachableId: string;
  mediaId: string;
  purpose: string;
  caption?: string;
  orderBy: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  /** Populated media relation (only when included in query) */
  media?: MediaModel;

  constructor(data?: Partial<MediaAttachmentModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
