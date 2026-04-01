import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { VehicleServiceModel } from '../models/vehicle-service.model';
import slugify from 'slugify';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';

@Injectable()
export class VehicleServiceUtil {
  mapList(
    vehicleServices: VehicleServiceModel[]
  ): VehicleServiceListResponseDto[] {
    return vehicleServices.map(
      c => this.mapOne(c) as any as VehicleServiceListResponseDto
    );
  }

  mapActivityLogMetadata(
    vehicleService: VehicleServiceModel
  ): IActivityLogMetadata {
    return {
      _id: vehicleService.id,
      name: vehicleService.name,
      slug: vehicleService.slug,
    };
  }

  mapOne(vehicleService: VehicleServiceModel): VehicleServiceDto {
    const obj = plainToInstance(VehicleServiceDto, vehicleService);
    if ((vehicleService as any).serviceCategoryId) {
      obj.serviceCategory = (vehicleService as any).serviceCategoryId;
    }

    // Safely extract IDs if checklist items are joined objects
    if (
      (vehicleService as any).checklistItems &&
      Array.isArray((vehicleService as any).checklistItems)
    ) {
      obj.checklistItems = (vehicleService as any).checklistItems.map(
        (item: any) =>
          typeof item === 'object' && item !== null ? item.id : item
      );
    }
    return obj;
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
