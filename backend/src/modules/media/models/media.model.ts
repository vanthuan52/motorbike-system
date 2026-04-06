import {
  EnumMediaAccessibility,
  EnumMediaPurpose,
  EnumMediaStatus,
  EnumMediaType,
} from '../enums/media.enum';

/**
 * Domain model representing a media file (image, video, document).
 * Maps from Prisma Media to application domain layer.
 */
export class MediaModel {
  id: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
  extension: string;
  bucket: string;
  cdnUrl?: string;
  completedUrl: string;
  type: EnumMediaType;
  purpose: EnumMediaPurpose;
  status: EnumMediaStatus;
  accessibility: EnumMediaAccessibility;
  metadata?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<MediaModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumMediaStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
