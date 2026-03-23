import { UserVehicleModel } from '../models/user-vehicle.model';

export class UserVehicleMapper {
  static toDomain(prismaVehicle: any): UserVehicleModel {
    const model = new UserVehicleModel();
    model.id = prismaVehicle.id;
    model.modelYear = prismaVehicle.modelYear;
    model.color = prismaVehicle.color;
    model.licensePlateNumber = prismaVehicle.licensePlateNumber;
    model.engineNumber = prismaVehicle.engineNumber;
    model.chassisNumber = prismaVehicle.chassisNumber;
    model.photo = prismaVehicle.photo;
    model.userId = prismaVehicle.userId;
    model.vehicleModelId = prismaVehicle.vehicleModelId;

    model.createdAt = prismaVehicle.createdAt;
    model.updatedAt = prismaVehicle.updatedAt;
    model.deletedAt = prismaVehicle.deletedAt;
    model.createdBy = prismaVehicle.createdBy;
    model.updatedBy = prismaVehicle.updatedBy;
    model.deletedBy = prismaVehicle.deletedBy;

    return model;
  }
}
