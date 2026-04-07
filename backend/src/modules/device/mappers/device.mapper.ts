import { DeviceModel, DeviceOwnershipModel } from '../models/device.model';
import {
  EnumDeviceNotificationProvider,
  EnumDevicePlatform,
} from '../enums/device.enum';
import {
  Device as PrismaDevice,
  DeviceOwnership as PrismaDeviceOwnership,
} from '@/generated/prisma-client';

export class DeviceMapper {
  static toDeviceDomain(prismaDevice: PrismaDevice): DeviceModel {
    const model = new DeviceModel();
    model.id = prismaDevice.id;
    model.fingerprint = prismaDevice.fingerprint;
    model.name = prismaDevice.name;
    model.platform = prismaDevice.platform as EnumDevicePlatform;
    model.lastActiveAt = prismaDevice.lastActiveAt;
    model.notificationToken = prismaDevice.notificationToken;
    model.notificationProvider =
      prismaDevice.notificationProvider as EnumDeviceNotificationProvider;

    model.createdAt = prismaDevice.createdAt;
    model.createdBy = prismaDevice.createdBy;
    model.updatedAt = prismaDevice.updatedAt;
    model.updatedBy = prismaDevice.updatedBy;

    return model;
  }

  static toDeviceOwnershipDomain(
    prismaOwnership: PrismaDeviceOwnership | any
  ): DeviceOwnershipModel {
    const model = new DeviceOwnershipModel();
    model.id = prismaOwnership.id;
    model.deviceId = prismaOwnership.deviceId;
    model.userId = prismaOwnership.userId;
    model.revokedAt = prismaOwnership.revokedAt;
    model.isRevoked = prismaOwnership.isRevoked;
    model.revokedById = prismaOwnership.revokedById;
    model.lastActiveAt = prismaOwnership.lastActiveAt;

    model.createdAt = prismaOwnership.createdAt;
    model.createdBy = prismaOwnership.createdBy;
    model.updatedAt = prismaOwnership.updatedAt;
    model.updatedBy = prismaOwnership.updatedBy;

    // Map nested relations if they exist
    if (prismaOwnership.device) {
      (model as any).device = this.toDeviceDomain(prismaOwnership.device);
    }

    return model;
  }
}
