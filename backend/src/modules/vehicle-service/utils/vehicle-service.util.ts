import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import { IVehicleServiceEntity } from '../interfaces/vehicle-service.interface';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';

@Injectable()
export class VehicleServiceUtil {
  mapList(
    vehicleServices: VehicleServiceDoc[] | IVehicleServiceEntity[],
  ): VehicleServiceListResponseDto[] {
    return plainToInstance(
      VehicleServiceListResponseDto,
      vehicleServices.map((c: VehicleServiceDoc | IVehicleServiceEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(
    vehicleService: VehicleServiceDoc | IVehicleServiceEntity,
  ): VehicleServiceDto {
    return plainToInstance(
      VehicleServiceDto,
      vehicleService instanceof Document
        ? vehicleService.toObject()
        : vehicleService,
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
