import { VehicleModelModel } from '../models/vehicle-model.model';
import { VehicleBrandMapper } from '@/modules/vehicle-brand/mappers/vehicle-brand.mapper';
import { VehicleModel as PrismaVehicleModel } from '@/generated/prisma-client';

export class VehicleModelMapper {
  static toDomain(prismaModel: PrismaVehicleModel): VehicleModelModel {
    const model = new VehicleModelModel();
    model.id = prismaModel.id;
    model.name = prismaModel.name;
    model.fullName = prismaModel.fullName;
    model.slug = prismaModel.slug;
    model.description = prismaModel.description;
    model.engineDisplacement = prismaModel.engineDisplacement;
    model.modelYear = prismaModel.modelYear;
    model.type = prismaModel.type;
    model.fuelType = prismaModel.fuelType;
    model.status = prismaModel.status;
    model.orderBy = prismaModel.orderBy;
    model.yearStart = prismaModel.yearStart;
    model.yearEnd = prismaModel.yearEnd;
    model.photoCdnUrl = prismaModel.photoCdnUrl ?? undefined;
    model.vehicleBrandId = prismaModel.vehicleBrandId;

    model.createdAt = prismaModel.createdAt;
    model.updatedAt = prismaModel.updatedAt;
    model.deletedAt = prismaModel.deletedAt;
    model.createdBy = prismaModel.createdBy;
    model.updatedBy = prismaModel.updatedBy;
    model.deletedBy = prismaModel.deletedBy;

    if (prismaModel.vehicleBrand) {
      model.vehicleBrand = VehicleBrandMapper.toDomain(
        prismaModel.vehicleBrand
      );
    }

    return model;
  }
}
