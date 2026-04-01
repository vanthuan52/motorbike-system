import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';
import { UserVehicleModel } from '../models/user-vehicle.model';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';

@Injectable()
export class UserVehicleUtil {
  mapList(userVehicles: UserVehicleModel[]): UserVehicleListResponseDto[] {
    return userVehicles.map(c => this.mapGet(c) as any as UserVehicleListResponseDto);
  }

  mapGet(userVehicle: UserVehicleModel): UserVehicleDto {
    const obj = plainToInstance(UserVehicleDto, userVehicle);
    if (userVehicle.userId) {
      obj.user = userVehicle.userId;
    }
    if (userVehicle.vehicleModelId) {
      obj.vehicleModel = userVehicle.vehicleModelId;
    }
    return obj;
  }

  mapActivityLogMetadata(
    userVehicle: UserVehicleModel
  ): IActivityLogMetadata {
    return {
      _id: userVehicle.id,
      licensePlateNumber: userVehicle.licensePlateNumber,
    };
  }
}
