import { PartType as PrismaPartType } from '@/generated/prisma-client';
import { EnumPartTypeStatus } from '../enums/part-type.enum';
import { PartTypeModel } from '../models/part-type.model';

export class PartTypeMapper {
  static toDomain(prismaPartType: PrismaPartType): PartTypeModel {
    const model = new PartTypeModel();
    model.id = prismaPartType.id;
    model.name = prismaPartType.name;
    model.slug = prismaPartType.slug;
    model.description = prismaPartType.description ?? undefined;
    model.orderBy = prismaPartType.orderBy;
    model.status = prismaPartType.status as EnumPartTypeStatus;

    model.createdAt = prismaPartType.createdAt;
    model.updatedAt = prismaPartType.updatedAt;
    model.deletedAt = prismaPartType.deletedAt ?? undefined;
    model.createdBy = prismaPartType.createdBy ?? undefined;
    model.updatedBy = prismaPartType.updatedBy ?? undefined;
    model.deletedBy = prismaPartType.deletedBy ?? undefined;

    return model;
  }
}
