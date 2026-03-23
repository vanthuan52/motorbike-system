import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';
import { UserVehicle } from '@/generated/prisma-client';

@Injectable()
export class UserVehicleUtil {
  mapList(userVehicles: UserVehicle[]): UserVehicleListResponseDto[] {
    return userVehicles.map(c => this.mapGet(c) as UserVehicleListResponseDto);
  }

  mapGet(userVehicle: UserVehicle): UserVehicleDto {
    const obj = plainToInstance(UserVehicleDto, userVehicle);
    if (userVehicle.userId) {
      obj.user = userVehicle.userId;
    }
    if (userVehicle.vehicleModelId) {
      obj.vehicleModel = userVehicle.vehicleModelId;
    }
    return obj;
  }
}
