import { EnumServiceCategoryStatus } from '../enums/service-category.enum';
import { MediaAttachmentModel } from '@/modules/media/models/media-attachment.model';

/**
 * Domain model representing a service category.
 * Maps from Prisma ServiceCategory to application domain layer.
 */
export class ServiceCategoryModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: number;
  status: EnumServiceCategoryStatus;
  photoCdnUrl?: string;
  mediaAttachments?: MediaAttachmentModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<ServiceCategoryModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumServiceCategoryStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
