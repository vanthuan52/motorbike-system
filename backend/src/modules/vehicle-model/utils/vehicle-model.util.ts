import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleModel } from '@/generated/prisma-client';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';

@Injectable()
export class VehicleModelUtil {
  mapList(vehicleModels: VehicleModel[]): VehicleModelListResponseDto[] {
    return vehicleModels.map(
      c => this.mapGet(c) as VehicleModelListResponseDto
    );
  }

  mapGet(vehicleModel: VehicleModel): VehicleModelDto {
    const obj = plainToInstance(VehicleModelDto, vehicleModel);
    if (vehicleModel.vehicleBrandId) {
      obj.vehicleBrand = vehicleModel.vehicleBrandId;
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
