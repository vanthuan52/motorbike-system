import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import { VehicleModelMapper } from '@/modules/vehicle-model/mappers/vehicle-model.mapper';
import { PartMapper } from '@/modules/part/mappers/part.mapper';
import {
  Part as PrismaPart,
  VehicleBrand as PrismaVehicleBrand,
  VehicleModel as PrismaVehicleModel,
} from '@/generated/prisma-client';

type PrismaVehicleBrandWithRelations = PrismaVehicleBrand & {
  vehicleModels?: PrismaVehicleModel[];
  parts?: PrismaPart[];
};

export class VehicleBrandMapper {
  static toDomain(
    prismaBrand: PrismaVehicleBrandWithRelations
  ): VehicleBrandModel {
    const model = new VehicleBrandModel();
    model.id = prismaBrand.id;
    model.name = prismaBrand.name;
    model.slug = prismaBrand.slug;
    model.description = prismaBrand.description;
    model.orderBy = prismaBrand.orderBy;
    model.country = prismaBrand.country;
    model.status = prismaBrand.status as EnumVehicleBrandStatus;
    model.photoCdnUrl = prismaBrand.photoCdnUrl ?? undefined;

    if (prismaBrand.vehicleModels) {
      model.vehicleModels = prismaBrand.vehicleModels.map(vm =>
        VehicleModelMapper.toDomain(vm as any)
      );
    }

    if (prismaBrand.parts) {
      model.parts = prismaBrand.parts.map(p => PartMapper.toDomain(p as any));
    }

    model.createdAt = prismaBrand.createdAt;
    model.updatedAt = prismaBrand.updatedAt;
    model.deletedAt = prismaBrand.deletedAt;
    model.createdBy = prismaBrand.createdBy;
    model.updatedBy = prismaBrand.updatedBy;
    model.deletedBy = prismaBrand.deletedBy;

    return model;
  }
}
