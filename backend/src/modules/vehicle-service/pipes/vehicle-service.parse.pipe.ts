import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { VehicleServiceDoc } from '../entities/vehicle-service.entity';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '../enums/vehicle-service.status-code.enum';

@Injectable()
export class VehicleServiceParsePipe implements PipeTransform {
  constructor(private readonly vehicleServiceService: VehicleServiceService) {}

  async transform(value: any) {
    const vehicleService: VehicleServiceDoc | null =
      await this.vehicleServiceService.findOneById(value);

    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    }

    return vehicleService;
  }
}

@Injectable()
export class VehicleServiceActiveParsePipe implements PipeTransform {
  constructor(private readonly vehicleServiceService: VehicleServiceService) {}

  async transform(value: any) {
    const vehicleService =
      await this.vehicleServiceService.findOneWithServiceCategoryById(value);
    if (!vehicleService) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-service.error.notFound',
      });
    }

    return vehicleService;
  }
}
