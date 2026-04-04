import { ServiceCategoryModel } from '../models/service-category.model';
import { EnumServiceCategoryStatus } from '../enums/service-category.enum';
import { ServiceCategory as PrismaServiceCategory } from '@/generated/prisma-client';

export class ServiceCategoryMapper {
  static toDomain(
    prismaCategory: PrismaServiceCategory
  ): ServiceCategoryModel {
    const model = new ServiceCategoryModel();
    model.id = prismaCategory.id;
    model.name = prismaCategory.name;
    model.slug = prismaCategory.slug;
    model.description = prismaCategory.description;
    model.orderBy = prismaCategory.orderBy;
    model.status = prismaCategory.status as EnumServiceCategoryStatus;
    model.photoCdnUrl = prismaCategory.photoCdnUrl ?? undefined;

    model.createdAt = prismaCategory.createdAt;
    model.updatedAt = prismaCategory.updatedAt;
    model.deletedAt = prismaCategory.deletedAt;
    model.createdBy = prismaCategory.createdBy;
    model.updatedBy = prismaCategory.updatedBy;
    model.deletedBy = prismaCategory.deletedBy;

    return model;
  }
}
