import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServiceCategory } from '@/generated/prisma-client';
import slugify from 'slugify';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryDto } from '../dtos/service-category.dto';

@Injectable()
export class ServiceCategoryUtil {
  mapList(
    serviceCategories: ServiceCategory[]
  ): ServiceCategoryListResponseDto[] {
    return plainToInstance(ServiceCategoryListResponseDto, serviceCategories);
  }

  mapGet(serviceCategory: ServiceCategory): ServiceCategoryDto {
    return plainToInstance(ServiceCategoryDto, serviceCategory);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
