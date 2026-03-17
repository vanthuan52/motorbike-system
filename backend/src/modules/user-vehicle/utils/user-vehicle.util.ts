import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { IUserVehicleEntity } from '../interfaces/user-vehicle.interface';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';

@Injectable()
export class UserVehicleUtil {
  mapList(
    userVehicles: UserVehicleDoc[] | IUserVehicleEntity[],
  ): UserVehicleListResponseDto[] {
    return plainToInstance(
      UserVehicleListResponseDto,
      userVehicles.map((c: UserVehicleDoc | IUserVehicleEntity) =>
        c instanceof Document ? c.toObject() : c,
      ),
    );
  }

  mapGet(userVehicle: UserVehicleDoc | IUserVehicleEntity): UserVehicleDto {
    return plainToInstance(
      UserVehicleDto,
      userVehicle instanceof Document ? userVehicle.toObject() : userVehicle,
    );
  }
}
