import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleBrandModel } from '../models/vehicle-brand.model';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';

@Injectable()
export class VehicleBrandUtil {
  mapList(vehicleBrands: VehicleBrandModel[]): VehicleBrandListResponseDto[] {
    return plainToInstance(VehicleBrandListResponseDto, vehicleBrands);
  }

  mapGet(vehicleBrand: VehicleBrandModel): VehicleBrandDto {
    return plainToInstance(VehicleBrandDto, vehicleBrand);
  }

  createSlug(name: string): string {
    return slugify(name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });
  }
}
