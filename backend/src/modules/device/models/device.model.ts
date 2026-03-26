import {
  EnumDevicePlatform,
  EnumDeviceNotificationProvider,
} from '../enums/device.enum';

export class DeviceModel {
  id: string;
  fingerprint: string;
  name?: string;
  platform: EnumDevicePlatform;
  lastActiveAt: Date;
  notificationToken?: string;
  notificationProvider?: EnumDeviceNotificationProvider;

  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}

export class DeviceOwnershipModel {
  id: string;
  deviceId: string;
  userId: string;
  revokedAt?: Date;
  isRevoked: boolean;
  revokedById?: string;
  lastActiveAt: Date;

  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
}
