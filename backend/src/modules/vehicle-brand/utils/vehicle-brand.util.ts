import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';

@Injectable()
export class VehicleBrandUtil {
  mapList(vehicleBrands: VehicleBrandModel[]): VehicleBrandListResponseDto[] {
    return plainToInstance(VehicleBrandListResponseDto, vehicleBrands);
  }

  mapOne(vehicleBrand: VehicleBrandModel): VehicleBrandDto {
    return plainToInstance(VehicleBrandDto, vehicleBrand);
  }

  mapActivityLogMetadata(
    vehicleBrand: VehicleBrandModel
  ): IActivityLogMetadata {
    return {
      _id: vehicleBrand.id,
      name: vehicleBrand.name,
      slug: vehicleBrand.slug,
    };
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
