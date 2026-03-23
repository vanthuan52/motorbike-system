export class UserVehicleModel {
  id: string;
  modelYear?: number;
  color?: string;
  licensePlateNumber: string;
  engineNumber?: string;
  chassisNumber?: string;
  photo?: any;
  userId: string;
  vehicleModelId: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}
