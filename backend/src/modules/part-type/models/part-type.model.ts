import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { MediaAttachmentModel } from '@/modules/media/models/media-attachment.model';

/**
 * Domain model representing a part type/category.
 * Maps from Prisma PartType to application domain layer.
 */
export class PartTypeModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: number;
  status: EnumPartTypeStatus;
  photoCdnUrl?: string;
  mediaAttachments?: MediaAttachmentModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<PartTypeModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumPartTypeStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
