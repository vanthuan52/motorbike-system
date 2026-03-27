import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { EnumVehicleBrandStatus } from '../enums/vehicle-brand.enum';
import { VehicleBrand as PrismaVehicleBrand } from '@/generated/prisma-client';

export class VehicleBrandMapper {
  static toDomain(prismaBrand: PrismaVehicleBrand): VehicleBrandModel {
    const model = new VehicleBrandModel();
    model.id = prismaBrand.id;
    model.name = prismaBrand.name;
    model.slug = prismaBrand.slug;
    model.description = prismaBrand.description;
    model.orderBy = prismaBrand.orderBy;
    model.country = prismaBrand.country;
    model.status = prismaBrand.status?.toLowerCase() as EnumVehicleBrandStatus;
    model.photo = prismaBrand.photo;

    model.createdAt = prismaBrand.createdAt;
    model.updatedAt = prismaBrand.updatedAt;
    model.deletedAt = prismaBrand.deletedAt;
    model.createdBy = prismaBrand.createdBy;
    model.updatedBy = prismaBrand.updatedBy;
    model.deletedBy = prismaBrand.deletedBy;

    return model;
  }
}
