import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import { VehicleModelModel } from '@/modules/vehicle-model/models/vehicle-model.model';
import { PartModel } from '@/modules/part/models/part.model';
import { MediaAttachmentModel } from '@/modules/media/models/media-attachment.model';

/**
 * Domain model representing a vehicle brand (e.g., Honda, Yamaha).
 * Maps from Prisma VehicleBrand to application domain layer.
 */
export class VehicleBrandModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: number;
  country?: string;
  status: EnumVehicleBrandStatus;
  photoCdnUrl?: string;
  mediaAttachments?: MediaAttachmentModel[];
  vehicleModels?: VehicleModelModel[];
  parts?: PartModel[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<VehicleBrandModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return this.status === EnumVehicleBrandStatus.active && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
