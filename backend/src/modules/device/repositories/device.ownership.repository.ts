import { Injectable } from '@nestjs/common';
import { Duration } from 'luxon';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { FirebaseStaleTokenThresholdInDays } from '@/common/firebase/constants/firebase.constant';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IPaginationCursorReturn,
  IPaginationEqual,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { DeviceOwnershipModel } from '@/modules/device/models/device.model';
import { DeviceMapper } from '@/modules/device/mappers/device.mapper';
import { DeviceRefreshRequestDto } from '@/modules/device/dtos/requests/device.refresh.dto';
import { DeviceRequestDto } from '@/modules/device/dtos/requests/device.request.dto';
import {
  EnumDeviceNotificationProvider,
  EnumDevicePlatform,
} from '../enums/device.enum';
import {
  Prisma,
  DeviceOwnership as PrismaDeviceOwnership,
} from '@/generated/prisma-client';
import { IDeviceCheckingResult } from '../interfaces/device.interface';

@Injectable()
export class DeviceOwnershipRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly helperService: HelperService,
    private readonly paginationService: PaginationService,
    private readonly databaseUtil: DatabaseUtil
  ) {}

  async findWithPaginationOffsetByAdmin(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryOffsetParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >,
    isRevoked?: Record<string, IPaginationEqual>
  ): Promise<IPaginationOffsetReturn<DeviceOwnershipModel>> {
    const today = this.helperService.dateCreate();

    const paginatedResult =
      await this.paginationService.offset<PrismaDeviceOwnership>(
        this.databaseService.deviceOwnership,
        {
          ...others,
          where: {
            ...where,
            ...isRevoked,
            userId,
          },
          include: {
            device: true,
            user: true,
            _count: {
              select: {
                sessions: {
                  where: {
                    isRevoked: false,
                    expiredAt: {
                      gt: today,
                    },
                  },
                },
              },
            },
          },
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(
        item =>
          DeviceMapper.toDeviceOwnershipDomain(item) as DeviceOwnershipModel
      ),
    };
  }

  async findActiveWithPaginationCursor(
    userId: string,
    sessionId: string,
    {
      where,
      ...others
    }: IPaginationQueryCursorParams<
      Prisma.DeviceOwnershipSelect,
      Prisma.DeviceOwnershipWhereInput
    >
  ): Promise<IPaginationCursorReturn<DeviceOwnershipModel>> {
    const today = this.helperService.dateCreate();

    const paginatedResult =
      await this.paginationService.cursor<PrismaDeviceOwnership>(
        this.databaseService.deviceOwnership,
        {
          ...others,
          where: {
            ...where,
            userId,
            isRevoked: false,
          },
          include: {
            device: true,
            user: true,
            _count: {
              select: {
                sessions: {
                  where: {
                    isRevoked: false,
                    expiredAt: {
                      gt: today,
                    },
                  },
                },
              },
            },
            sessions: {
              where: {
                id: sessionId,
              },
              take: 1,
            },
          },
          includeCount: true,
        }
      );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(
        item =>
          DeviceMapper.toDeviceOwnershipDomain(item) as DeviceOwnershipModel
      ),
    };
  }

  async findTokensByUserId(userId: string): Promise<DeviceOwnershipModel[]> {
    const results = await this.databaseService.deviceOwnership.findMany({
      where: {
        userId,
        device: {
          notificationToken: { not: null },
        },
      },
      include: {
        device: true,
      },
    });

    return results.map((item: PrismaDeviceOwnership) =>
      DeviceMapper.toDeviceOwnershipDomain(item)
    );
  }

  async existActive(
    userId: string,
    deviceOwnershipId: string
  ): Promise<{ id: string } | null> {
    return this.databaseService.deviceOwnership.findUnique({
      where: {
        id: deviceOwnershipId,
        userId,
        isRevoked: false,
      },
      select: { id: true },
    });
  }

  async refresh(
    userId: string,
    deviceOwnershipId: string,
    { name, notificationToken, platform }: DeviceRefreshRequestDto
  ): Promise<DeviceOwnershipModel> {
    const today = this.helperService.dateCreate();

    let notificationProvider: EnumDeviceNotificationProvider | null = null;
    switch (platform) {
      case EnumDevicePlatform.android:
        notificationProvider = EnumDeviceNotificationProvider.fcm;
        break;
      case EnumDevicePlatform.ios:
        notificationProvider = EnumDeviceNotificationProvider.apns;
        break;
      default:
        notificationProvider = null;
        break;
    }

    const deviceOwnership = await this.databaseService.deviceOwnership.update({
      where: {
        id: deviceOwnershipId,
        userId,
      },
      data: {
        lastActiveAt: today,
        updatedBy: userId,
        device: {
          update: {
            name,
            platform,
            notificationProvider,
            notificationToken,
            lastActiveAt: today,
          },
        },
      },
      include: {
        device: true,
        user: true,
        _count: {
          select: {
            sessions: {
              where: {
                isRevoked: false,
                expiredAt: {
                  gt: today,
                },
              },
            },
          },
        },
      },
    });

    return DeviceMapper.toDeviceOwnershipDomain(deviceOwnership);
  }

  async remove(
    userId: string,
    deviceOwnershipId: string,
    removedBy: string
  ): Promise<DeviceOwnershipModel> {
    const today = this.helperService.dateCreate();
    const deviceOwnership = await this.databaseService.deviceOwnership.update({
      where: {
        id: deviceOwnershipId,
        userId,
      },
      data: {
        isRevoked: true,
        revokedAt: today,
        revokedBy: {
          connect: {
            id: removedBy,
          },
        },
        updatedBy: removedBy,
        device: {
          update: {
            notificationToken: null,
            notificationProvider: null,
            lastActiveAt: today,
            updatedBy: removedBy,
          },
        },
      },
      include: {
        device: true,
        user: true,
        _count: {
          select: {
            sessions: {
              where: {
                isRevoked: false,
                expiredAt: {
                  gt: today,
                },
              },
            },
          },
        },
      },
    });

    return DeviceMapper.toDeviceOwnershipDomain(deviceOwnership);
  }

  /**
   * Upsert device and manage device ownership during login flow.
   * Returns device ownership info and whether this is a new device.
   */
  async upsertForLogin(
    userId: string,
    { fingerprint, name, notificationToken, platform }: DeviceRequestDto,
    options?: IDatabaseOptions
  ): Promise<IDeviceCheckingResult> {
    const db = options?.tx || this.databaseService;
    const today = this.helperService.dateCreate();

    let notificationProvider: EnumDeviceNotificationProvider | null = null;
    switch (platform) {
      case EnumDevicePlatform.android:
        notificationProvider = EnumDeviceNotificationProvider.fcm;
        break;
      case EnumDevicePlatform.ios:
        notificationProvider = EnumDeviceNotificationProvider.apns;
        break;
      default:
        notificationProvider = null;
        break;
    }

    const device = await db.device.upsert({
      where: { fingerprint },
      update: {
        name,
        platform,
        notificationToken,
        lastActiveAt: today,
        notificationProvider,
        updatedBy: userId,
      },
      create: {
        fingerprint,
        name,
        platform,
        notificationToken,
        lastActiveAt: today,
        notificationProvider,
        createdBy: userId,
      },
    });

    let isNewDevice = false;
    let deviceOwnership = await db.deviceOwnership.findFirst({
      where: {
        deviceId: device.id,
        userId,
        isRevoked: false,
      },
    });

    if (!deviceOwnership) {
      isNewDevice = true;
      deviceOwnership = await db.deviceOwnership.create({
        data: {
          userId,
          createdBy: userId,
          lastActiveAt: today,
          isRevoked: false,
          deviceId: device.id,
        },
      });
    } else {
      await db.deviceOwnership.update({
        where: { id: deviceOwnership.id },
        data: {
          lastActiveAt: today,
          updatedBy: userId,
        },
      });
    }

    return {
      isNewDevice,
      deviceOwnershipId: deviceOwnership.id,
    };
  }

  async cleanupTokens(
    userId: string,
    tokens: string[]
  ): Promise<Prisma.BatchPayload> {
    const deviceIds = await this.databaseService.deviceOwnership.findMany({
      where: {
        userId,
        device: {
          notificationToken: {
            in: tokens,
          },
        },
      },
      select: {
        deviceId: true,
      },
    });

    const deviceIdList = deviceIds.map(
      (d: PrismaDeviceOwnership) => d.deviceId
    );

    return this.databaseService.device.updateMany({
      where: {
        id: {
          in: deviceIdList,
        },
      },
      data: {
        notificationToken: null,
        notificationProvider: null,
        updatedBy: userId,
      },
    });
  }

  async cleanupStaleTokens(
    thresholdInDays: number = FirebaseStaleTokenThresholdInDays
  ): Promise<Prisma.BatchPayload> {
    const today = this.helperService.dateCreate();
    const thresholdDate = this.helperService.dateBackward(
      today,
      Duration.fromObject({
        days: thresholdInDays,
      })
    );

    return this.databaseService.device.updateMany({
      where: {
        notificationToken: {
          not: null,
        },
        lastActiveAt: {
          lt: thresholdDate,
        },
      },
      data: {
        notificationToken: null,
        notificationProvider: null,
      },
    });
  }
}
