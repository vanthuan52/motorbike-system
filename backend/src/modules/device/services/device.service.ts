import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EnumAppStatusCodeError } from '@/app/enums/app.status-code.enum';
import {
  IPaginationEqual,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { DeviceRefreshRequestDto } from '@/modules/device/dtos/requests/device.refresh.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import { DeviceOwnershipResponseDto } from '@/modules/device/dtos/response/device.ownership.response';
import { EnumDeviceStatusCodeError } from '@/modules/device/enums/device.status-code.enum';
import { IDeviceService } from '@/modules/device/interfaces/device.service.interface';
import { DeviceOwnershipRepository } from '@/modules/device/repositories/device.ownership.repository';
import { DeviceUtil } from '@/modules/device/utils/device.util';
import { SessionRepository } from '@/modules/session/repositories/session.repository';
import { SessionUtil } from '@/modules/session/utils/session.util';
import { ActivityLogService } from '@/modules/activity-log/services/activity-log.service';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma, DeviceOwnership } from '@/generated/prisma-client';

@Injectable()
export class DeviceService implements IDeviceService {
  constructor(
    private readonly deviceOwnershipRepository: DeviceOwnershipRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly sessionUtil: SessionUtil,
    private readonly deviceUtil: DeviceUtil,
    private readonly activityLogService: ActivityLogService
  ) {}

  async getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >,
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<DeviceOwnershipResponseDto>> {
    const { data, ...others } =
      await this.deviceOwnershipRepository.findWithPaginationOffsetByAdmin(
        userId,
        pagination,
        isRevoked
      );

    const deviceOwnerships: DeviceOwnershipResponseDto[] =
      this.deviceUtil.mapList(data);
    return { data: deviceOwnerships, ...others };
  }

  async getListCursor(
    userId: string,
    sessionId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >
  ): Promise<IPaginationCursorReturn<DeviceOwnershipResponseDto>> {
    const { data, ...others } =
      await this.deviceOwnershipRepository.findActiveWithPaginationCursor(
        userId,
        sessionId,
        pagination
      );

    const deviceOwnerships: DeviceOwnershipResponseDto[] =
      this.deviceUtil.mapList(data);

    return { data: deviceOwnerships, ...others };
  }

  async refresh(
    userId: string,
    deviceOwnershipId: string,
    { name, notificationToken, platform }: DeviceRefreshRequestDto,
    requestLog: IRequestLog
  ): Promise<void> {
    const existDeviceOwnership =
      await this.deviceOwnershipRepository.existActive(
        userId,
        deviceOwnershipId
      );
    if (!existDeviceOwnership) {
      throw new NotFoundException({
        statusCode: EnumDeviceStatusCodeError.notFound,
        message: 'device.error.notFound',
      });
    }

    try {
      await Promise.all([
        this.deviceOwnershipRepository.refresh(
          userId,
          existDeviceOwnership.id,
          {
            name,
            notificationToken,
            platform,
          }
        ),
        this.activityLogService.create(
          userId,
          EnumActivityLogAction.userDeviceRefresh,
          requestLog
        ),
      ]);

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async remove(
    userId: string,
    deviceOwnershipId: string,
    requestLog: IRequestLog
  ): Promise<void> {
    const existDeviceOwnership =
      await this.deviceOwnershipRepository.existActive(
        userId,
        deviceOwnershipId
      );
    if (!existDeviceOwnership) {
      throw new NotFoundException({
        statusCode: EnumDeviceStatusCodeError.notFound,
        message: 'device.error.notFound',
      });
    }

    try {
      const sessions = await this.sessionRepository.findActiveByDeviceOwnership(
        userId,
        existDeviceOwnership.id
      );

      await Promise.all([
        this.deviceOwnershipRepository.remove(
          userId,
          existDeviceOwnership.id,
          userId
        ),
        this.activityLogService.create(
          userId,
          EnumActivityLogAction.userRemoveDevice,
          requestLog
        ),
        this.sessionUtil.deleteAllLogins(userId, sessions),
      ]);

      return;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  async removeByAdmin(
    userId: string,
    deviceOwnershipId: string,
    requestLog: IRequestLog,
    removedBy: string
  ): Promise<DeviceOwnership> {
    const existDeviceOwnership =
      await this.deviceOwnershipRepository.existActive(
        userId,
        deviceOwnershipId
      );
    if (!existDeviceOwnership) {
      throw new NotFoundException({
        statusCode: EnumDeviceStatusCodeError.notFound,
        message: 'device.error.notFound',
      });
    }

    try {
      const sessions = await this.sessionRepository.findActiveByDeviceOwnership(
        userId,
        existDeviceOwnership.id
      );

      const [removed] = await Promise.all([
        this.deviceOwnershipRepository.remove(
          userId,
          existDeviceOwnership.id,
          removedBy
        ),
        this.activityLogService.create(
          removedBy,
          EnumActivityLogAction.adminDeviceRemove,
          requestLog
        ),
        this.sessionUtil.deleteAllLogins(userId, sessions),
      ]);

      return removed;
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: EnumAppStatusCodeError.unknown,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  // =========================== Cross-module service calls ==============================

  async upsertForLogin(
    userId: string,
    device: DeviceRequestDto,
    options?: IDatabaseOptions
  ): Promise<{
    isNewDevice: boolean;
    deviceOwnershipId: string;
  }> {
    return this.deviceOwnershipRepository.upsertForLogin(
      userId,
      device,
      options
    );
  }
}
