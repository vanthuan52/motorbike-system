import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserVehicleService } from '../services/user-vehicle.service';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '../enums/user-vehicle.status-code.enum';

@Injectable()
export class UserVehicleParsePipe implements PipeTransform {
  constructor(private readonly userVehicleService: UserVehicleService) {}

  async transform(value: any) {
    const UserVehicle: UserVehicleDoc | null =
      await this.userVehicleService.findOneById(value);

    if (!UserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    return UserVehicle;
  }
}

@Injectable()
export class UserVehicleActiveParsePipe implements PipeTransform {
  constructor(private readonly userVehicleService: UserVehicleService) {}

  async transform(value: any) {
    const UserVehicle =
      await this.userVehicleService.findOneWithVehicleModelById(value);
    if (!UserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    return UserVehicle;
  }
}
