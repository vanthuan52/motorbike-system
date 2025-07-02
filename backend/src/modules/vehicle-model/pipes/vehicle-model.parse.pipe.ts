import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { VehicleModelService } from '../services/vehicle-model.service';
import { VehicleModelDoc } from '../entities/vehicle-model.entity';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '../enums/vehicle-model.status-code.enum';

@Injectable()
export class VehicleModelParsePipe implements PipeTransform {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  async transform(value: any) {
    const vehicleModel: VehicleModelDoc | null =
      await this.vehicleModelService.findOneById(value);

    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    return vehicleModel;
  }
}

@Injectable()
export class VehicleModelActiveParsePipe implements PipeTransform {
  constructor(private readonly vehicleModelService: VehicleModelService) {}

  async transform(value: any) {
    const vehicleModel =
      await this.vehicleModelService.findOneWithVehicleBrandById(value);
    if (!vehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    return vehicleModel;
  }
}
