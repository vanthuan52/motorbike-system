import { VehicleModelModel } from '../models/vehicle-model.model';
import {
  EnumVehicleModelType,
  EnumVehicleModelFuelType,
} from '../enums/vehicle-model.enum';
import { VehicleBrandMapper } from '@/modules/vehicle-brand/mappers/vehicle-brand.mapper';

export class VehicleModelMapper {
  static toDomain(prismaModel: any): VehicleModelModel {
    const model = new VehicleModelModel();
    model.id = prismaModel.id;
    model.name = prismaModel.name;
    model.fullName = prismaModel.fullName;
    model.slug = prismaModel.slug;
    model.description = prismaModel.description;
    model.engineDisplacement = prismaModel.engineDisplacement;
    model.modelYear = prismaModel.modelYear;
    const typeMap: Record<string, EnumVehicleModelType> = {
      SCOOTER: EnumVehicleModelType.scooter,
      MANUAL_OR_CLUTCH: EnumVehicleModelType.manualOrClutch,
      MANUAL: EnumVehicleModelType.manual,
      CLUTCH: EnumVehicleModelType.clutch,
      ELECTRIC: EnumVehicleModelType.electric,
    };
    model.type = typeMap[prismaModel.type] || EnumVehicleModelType.unknown;
    model.fuelType =
      prismaModel.fuelType?.toLowerCase() as EnumVehicleModelFuelType;
    model.status = prismaModel.status?.toLowerCase();
    model.orderBy = prismaModel.order;
    model.yearStart = prismaModel.yearStart;
    model.yearEnd = prismaModel.yearEnd;
    model.photo = prismaModel.photo;
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
