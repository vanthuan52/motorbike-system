import { UserModel } from '@/modules/user/models/user.model';
import { VehicleModelModel } from '@/modules/vehicle-model/models/vehicle-model.model';
import { MediaAttachmentModel } from '@/modules/media/models/media-attachment.model';

/**
 * Domain model representing a user's vehicle.
 * Maps from Prisma UserVehicle to application domain layer.
 */
export class UserVehicleModel {
  id: string;
  modelYear?: number;
  color?: string;
  licensePlateNumber: string;
  engineNumber?: string;
  chassisNumber?: string;
  photoCdnUrl?: string;
  mediaAttachments?: MediaAttachmentModel[];

  userId: string;
  user?: UserModel;
  vehicleModelId: string;
  vehicleModel?: VehicleModelModel;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;

  constructor(data?: Partial<UserVehicleModel>) {
    Object.assign(this, data);
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
