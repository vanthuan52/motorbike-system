import { UserVehicleModel } from '../models/user-vehicle.model';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { VehicleModelMapper } from '@/modules/vehicle-model/mappers/vehicle-model.mapper';

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

    if (prismaVehicle.user) {
      model.user = UserMapper.toDomain(prismaVehicle.user);
    }
    if (prismaVehicle.vehicleModel) {
      model.vehicleModel = VehicleModelMapper.toDomain(prismaVehicle.vehicleModel);
    }

    return model;
  }
}
