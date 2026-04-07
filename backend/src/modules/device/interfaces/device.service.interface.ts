import {
  IPaginationCursorReturn,
  IPaginationEqual,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { DeviceRefreshRequestDto } from '@/modules/device/dtos/requests/device.refresh.dto';
import { DeviceOwnershipResponseDto } from '@/modules/device/dtos/response/device.ownership.response';
import { Prisma } from '@/generated/prisma-client';
import { DeviceOwnershipModel } from '../models/device.model';

export interface IDeviceService {
  getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >,
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<DeviceOwnershipResponseDto>>;
  getListCursor(
    userId: string,
    sessionId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >
  ): Promise<IPaginationCursorReturn<DeviceOwnershipResponseDto>>;
  refresh(
    userId: string,
    deviceOwnershipId: string,
    { name, notificationToken, platform }: DeviceRefreshRequestDto,
    requestLog: IRequestLog
  ): Promise<void>;
  remove(
    userId: string,
    deviceOwnershipId: string,
    requestLog: IRequestLog
  ): Promise<void>;
  removeByAdmin(
    userId: string,
    deviceOwnershipId: string,
    requestLog: IRequestLog,
    removedBy: string
  ): Promise<any>;
}
