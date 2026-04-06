import { PartModel } from '../models/part.model';
import { PartTypeMapper } from '@/modules/part-type/mappers/part-type.mapper';
import { VehicleBrandMapper } from '@/modules/vehicle-brand/mappers/vehicle-brand.mapper';
import { EnumPartStatus } from '../enums/part.enum';
import { Part as PrismaPart, Prisma } from '@/generated/prisma-client';

type PrismaPartWithRelations = Prisma.PartGetPayload<{
  include: { partType: true; vehicleBrand: true };
}>;
export class PartMapper {
  static toDomain(prismaPart: PrismaPart | PrismaPartWithRelations): PartModel {
    const model = new PartModel();
    model.id = prismaPart.id;
    model.name = prismaPart.name;
    model.slug = prismaPart.slug;
    model.description = prismaPart.description;
    model.status = prismaPart.status as EnumPartStatus;
    model.orderBy = prismaPart.orderBy;
    model.partTypeId = prismaPart.partTypeId;
    model.vehicleBrandId = prismaPart.vehicleBrandId;
    model.photoCdnUrl = prismaPart.photoCdnUrl ?? undefined;

    model.createdAt = prismaPart.createdAt;
    model.updatedAt = prismaPart.updatedAt;
    model.deletedAt = prismaPart.deletedAt;
    model.createdBy = prismaPart.createdBy;
    model.updatedBy = prismaPart.updatedBy;
    model.deletedBy = prismaPart.deletedBy;

    if ('partType' in prismaPart && prismaPart.partType) {
      model.partType = PartTypeMapper.toDomain(prismaPart.partType);
    }
    if ('vehicleBrand' in prismaPart && prismaPart.vehicleBrand) {
      model.vehicleBrand = VehicleBrandMapper.toDomain(prismaPart.vehicleBrand);
    }

    return model;
  }
}
