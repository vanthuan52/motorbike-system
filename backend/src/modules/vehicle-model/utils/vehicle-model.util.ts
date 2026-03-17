import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import { IVehicleModelEntity } from '../interfaces/vehicle-model.interface';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';

@Injectable()
export class VehicleModelUtil {
  mapList(
    vehicleModels: VehicleModelDoc[] | IVehicleModelEntity[],
  ): VehicleModelListResponseDto[] {
    return plainToInstance(
      VehicleModelListResponseDto,
      vehicleModels.map((c: VehicleModelDoc | IVehicleModelEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(vehicleModel: VehicleModelDoc | IVehicleModelEntity): VehicleModelDto {
    return plainToInstance(
      VehicleModelDto,
      vehicleModel instanceof Document ? vehicleModel.toObject() : vehicleModel,
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
