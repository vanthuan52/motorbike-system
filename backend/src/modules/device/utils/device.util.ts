import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IActivityLogMetadata } from '@/modules/activity-log/interfaces/activity-log.interface';
import { DeviceOwnershipResponseDto } from '@/modules/device/dtos/response/device.ownership.response';
import { DeviceOwnershipModel } from '../models/device.model';

@Injectable()
export class DeviceUtil {
  mapList(devices: DeviceOwnershipModel[]): DeviceOwnershipResponseDto[] {
    return plainToInstance(DeviceOwnershipResponseDto, devices);
  }

  mapActivityLogMetadata(
    deviceOwnership: DeviceOwnershipModel
  ): IActivityLogMetadata {
    return {
      deviceOwnershipId: deviceOwnership.id,
      deviceId: deviceOwnership.deviceId,
      userId: deviceOwnership.userId,
      userUsername: (deviceOwnership as any).user?.username,
      timestamp: deviceOwnership.updatedAt ?? deviceOwnership.createdAt,
      sessionCount: (deviceOwnership as any)._count?.sessions,
    };
  }
}
