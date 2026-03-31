import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';

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
  photo?: AwsS3Dto;

  userId: string;
  vehicleModelId: string;

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
