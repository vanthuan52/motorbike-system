import { ServiceCategoryModel } from '@/modules/service-category/models/service-category.model';
import { MediaAttachmentModel } from '@/modules/media/models/media-attachment.model';
import { EnumVehicleServiceStatus } from '../enums/vehicle-service.enum';

/**
 * Domain model representing a vehicle service category item.
 * Maps from Prisma VehicleService to application domain layer.
 */
export class VehicleServiceModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: number;
  status: EnumVehicleServiceStatus;
  basePrice: number;
  photoCdnUrl?: string;
  mediaAttachments?: MediaAttachmentModel[];

  serviceCategoryId: string;
  serviceCategory?: ServiceCategoryModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<VehicleServiceModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumVehicleServiceStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
