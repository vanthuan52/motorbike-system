import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryDto } from '../dtos/service-category.dto';
import { ServiceCategoryModel } from '../models/service-category.model';

@Injectable()
export class ServiceCategoryUtil {
  mapList(
    serviceCategories: ServiceCategoryModel[]
  ): ServiceCategoryListResponseDto[] {
    return plainToInstance(ServiceCategoryListResponseDto, serviceCategories);
  }

  mapGet(serviceCategory: ServiceCategoryModel): ServiceCategoryDto {
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
