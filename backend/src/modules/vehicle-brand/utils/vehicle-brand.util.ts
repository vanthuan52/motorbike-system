import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleBrand } from '@/generated/prisma-client';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';

@Injectable()
export class VehicleBrandUtil {
  mapList(vehicleBrands: VehicleBrand[]): VehicleBrandListResponseDto[] {
    return plainToInstance(VehicleBrandListResponseDto, vehicleBrands);
  }

  mapGet(vehicleBrand: VehicleBrand): VehicleBrandDto {
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
