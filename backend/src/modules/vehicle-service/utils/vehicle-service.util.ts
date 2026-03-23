import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { VehicleService } from '@/generated/prisma-client';
import slugify from 'slugify';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';

@Injectable()
export class VehicleServiceUtil {
  mapList(vehicleServices: VehicleService[]): VehicleServiceListResponseDto[] {
    return vehicleServices.map(
      (c) => this.mapGet(c) as VehicleServiceListResponseDto,
    );
  }

  mapGet(vehicleService: VehicleService): VehicleServiceDto {
    const obj = plainToInstance(VehicleServiceDto, vehicleService);
    if ((vehicleService as any).serviceCategoryId) {
      obj.serviceCategory = (vehicleService as any).serviceCategoryId;
    }
    
    // Safely extract IDs if checklist items are joined objects
    if ((vehicleService as any).checklistItems && Array.isArray((vehicleService as any).checklistItems)) {
      obj.checklistItems = (vehicleService as any).checklistItems.map((item: any) => 
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
