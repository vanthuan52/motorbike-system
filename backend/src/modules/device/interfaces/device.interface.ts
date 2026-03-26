import { SessionModel } from '@/modules/session/models/session.model';
import { UserModel } from '@/modules/user/models/user.model';
import { DeviceModel, DeviceOwnershipModel } from '../models/device.model';

export interface IDevice extends DeviceModel {}
export interface IDeviceOwnership extends DeviceOwnershipModel {
  device: IDevice;
  user: UserModel;
  _count: {
    sessions: number;
  };
  sessions?: SessionModel[];
}
