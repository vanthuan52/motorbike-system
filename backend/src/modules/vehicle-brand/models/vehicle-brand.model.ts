import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';

/**
 * Domain model representing a vehicle brand (e.g., Honda, Yamaha).
 * Maps from Prisma VehicleBrand to application domain layer.
 */
export class VehicleBrandModel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  orderBy: string;
  country?: string;
  status: EnumVehicleBrandStatus;
  photo?: AwsS3Dto;

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
