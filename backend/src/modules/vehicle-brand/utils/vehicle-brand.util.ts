import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { VehicleBrandDoc } from '../entities/vehicle-brand.entity';
import { IVehicleBrandEntity } from '../interfaces/vehicle-brand.interface';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';

@Injectable()
export class VehicleBrandUtil {
  mapList(
    vehicleBrands: VehicleBrandDoc[] | IVehicleBrandEntity[],
  ): VehicleBrandListResponseDto[] {
    return plainToInstance(
      VehicleBrandListResponseDto,
      vehicleBrands.map((c: VehicleBrandDoc | IVehicleBrandEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(vehicleBrand: VehicleBrandDoc | IVehicleBrandEntity): VehicleBrandDto {
    return plainToInstance(
      VehicleBrandDto,
      vehicleBrand instanceof Document ? vehicleBrand.toObject() : vehicleBrand,
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
