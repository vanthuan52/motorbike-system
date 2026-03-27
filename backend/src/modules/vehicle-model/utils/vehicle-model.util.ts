import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleModelModel } from '../models/vehicle-model.model';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';

@Injectable()
export class VehicleModelUtil {
  mapList(vehicleModels: VehicleModelModel[]): VehicleModelListResponseDto[] {
    return vehicleModels.map(
      c => this.mapOne(c) as any as VehicleModelListResponseDto
    );
  }

  mapOne(vehicleModel: VehicleModelModel): VehicleModelDto {
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
