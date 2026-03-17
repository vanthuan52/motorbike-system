import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { ServiceCategoryDoc } from '../entities/service-category.entity';
import {
  IServiceCategoryDoc,
  IServiceCategoryEntity,
} from '../interfaces/service-category.interface';
import { ServiceCategoryListResponseDto } from '../dtos/response/service-category.list.response.dto';
import { ServiceCategoryDto } from '../dtos/service-category.dto';

@Injectable()
export class ServiceCategoryUtil {
  mapList(
    serviceCategories:
      | ServiceCategoryDoc[]
      | IServiceCategoryEntity[]
      | IServiceCategoryDoc[],
  ): ServiceCategoryListResponseDto[] {
    return plainToInstance(
      ServiceCategoryListResponseDto,
      serviceCategories.map((c: ServiceCategoryDoc | IServiceCategoryEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    serviceCategory:
      | ServiceCategoryDoc
      | IServiceCategoryEntity
      | IServiceCategoryDoc,
  ): ServiceCategoryDto {
    return plainToInstance(
      ServiceCategoryDto,
      serviceCategory instanceof Document
        ? serviceCategory.toObject()
        : serviceCategory,
    );
  }

  createSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
