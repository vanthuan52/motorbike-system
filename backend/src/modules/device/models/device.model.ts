import {
  EnumDevicePlatform,
  EnumDeviceNotificationProvider,
} from '../enums/device.enum';

/**
 * Domain model representing a physical device.
 * Maps from Prisma Device to application domain layer.
 */
export class DeviceModel {
  id: string;
  fingerprint: string;
  name?: string;
  platform: EnumDevicePlatform;
  lastActiveAt: Date;
  notificationToken?: string;
  notificationProvider?: EnumDeviceNotificationProvider;

  createdAt: Date;
  updatedAt: Date;

  createdBy?: string;
  updatedBy?: string;

  constructor(data?: Partial<DeviceModel>) {
    Object.assign(this, data);
  }
}

/**
 * Domain model representing the ownership relationship between a user and a device.
 * Maps from Prisma DeviceOwnership to application domain layer.
 */
export class DeviceOwnershipModel {
  id: string;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedById?: string;
  lastActiveAt: Date;

  deviceId: string;
  userId: string;

  createdAt: Date;
  updatedAt: Date;

  createdBy?: string;
  updatedBy?: string;

  devices?: DeviceModel[];

  constructor(data?: Partial<DeviceOwnershipModel>) {
    Object.assign(this, data);
  }

  isActive(): boolean {
    return !this.isRevoked;
  }
}
