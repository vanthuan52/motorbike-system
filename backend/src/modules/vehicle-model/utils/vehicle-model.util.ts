import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import slugify from 'slugify';
import { VehicleModelModel } from '../models/vehicle-model.model';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';

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

  mapActivityLogMetadata(
    vehicleModel: VehicleModelModel
  ): IActivityLogMetadata {
    return {
      _id: vehicleModel.id,
      name: vehicleModel.name,
      slug: vehicleModel.slug,
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
