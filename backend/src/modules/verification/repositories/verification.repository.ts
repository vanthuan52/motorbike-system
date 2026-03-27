import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { EnumUserStatus } from '@/modules/user/enums/user.enum';
import {
  EnumVerificationType,
} from '@/modules/verification/enums/verification.enum';
import { VerificationModel } from '@/modules/verification/models/verification.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class VerificationRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly databaseUtil: DatabaseUtil,
    private readonly helperService: HelperService
  ) {}

  async findOneActiveByVerificationEmailToken(
    token: string
  ): Promise<VerificationModel | null> {
    const today = this.helperService.dateCreate();

    return this.databaseService.verification.findFirst({
      where: {
        token,
        isUsed: false,
        type: EnumVerificationType.email,
        expiredAt: {
          gt: today,
        },
        user: {
          deletedAt: null,
          status: EnumUserStatus.active,
        },
      },
    });
  }

  async findOneLatestByVerificationEmail(
    userId: string
  ): Promise<VerificationModel | null> {
    return this.databaseService.verification.findFirst({
      where: {
        userId,
        type: EnumVerificationType.email,
        user: {
          deletedAt: null,
          status: EnumUserStatus.active,
        },
      },
      orderBy: {
        createdAt: EnumPaginationOrderDirectionType.desc,
      },
    });
  }

  async verifyEmail(
    id: string,
    userId: string,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<VerificationModel> {
    const today = this.helperService.dateCreate();

    return this.databaseService.verification.update({
      where: {
        id,
      },
      data: {
        isUsed: true,
        verifiedAt: today,
        user: {
          update: {
            verifiedAt: today,
            isVerified: true,
            activityLogs: {
              create: {
                action: EnumActivityLogAction.userVerifiedEmail,
                ipAddress,
                userAgent: this.databaseUtil.toPlainObject(userAgent),
                geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                createdBy: userId,
              },
            },
          },
        },
      },
    });
  }

  async requestVerificationEmail(
    userId: string,
    userEmail: string,
    { expiredAt, reference, hashedToken, type }: IUserVerificationCreate,
    { ipAddress, userAgent, geoLocation }: IRequestLog
  ): Promise<any> {
    const today = this.helperService.dateCreate();

    return this.databaseService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const [_, newVerification] = await Promise.all([
          tx.verification.updateMany({
            where: {
              userId,
              type,
              isUsed: false,
              expiredAt: {
                gt: today,
              },
            },
            data: {
              expiredAt: today,
            },
          }),
          tx.user.update({
            where: {
              id: userId,
            },
            data: {
              verifications: {
                create: {
                  expiredAt,
                  reference,
                  token: hashedToken,
                  type,
                  to: userEmail,
                  createdBy: userId,
                  createdAt: today,
                },
              },
              activityLogs: {
                create: {
                  action: EnumActivityLogAction.userSendVerificationEmail,
                  ipAddress,
                  userAgent: this.databaseUtil.toPlainObject(userAgent),
                  geoLocation: this.databaseUtil.toPlainObject(geoLocation),
                  createdBy: userId,
                },
              },
            },
          }),
        ]);

        return newVerification;
      }
    );
  }
}
