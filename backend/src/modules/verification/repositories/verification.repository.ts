import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import { HelperService } from '@/common/helper/services/helper.service';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { IUserVerificationCreate } from '@/modules/verification/interfaces/verification.interface';
import { EnumUserStatus } from '@/modules/user/enums/user.enum';
import { EnumVerificationType } from '@/modules/verification/enums/verification.enum';
import { VerificationModel } from '@/modules/verification/models/verification.model';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { VerificationMapper } from '@/modules/verification/mappers/verification.mapper';

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

    const result = await this.databaseService.verification.findFirst({
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

    return result ? VerificationMapper.toDomain(result) : null;
  }

  async findOneLatestByVerificationEmail(
    userId: string
  ): Promise<VerificationModel | null> {
    const result = await this.databaseService.verification.findFirst({
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

    return result ? VerificationMapper.toDomain(result) : null;
  }

  async verifyEmail(
    id: string,
    options?: IDatabaseOptions
  ): Promise<VerificationModel> {
    const today = this.helperService.dateCreate();
    const db = options?.tx || this.databaseService;

    const result = await db.verification.update({
      where: {
        id,
      },
      data: {
        isUsed: true,
        verifiedAt: today,
      },
    });

    return VerificationMapper.toDomain(result);
  }

  async requestVerificationEmail(
    userId: string,
    userEmail: string,
    { expiredAt, reference, hashedToken, type }: IUserVerificationCreate,
    options?: IDatabaseOptions
  ): Promise<VerificationModel> {
    const today = this.helperService.dateCreate();
    const db = options?.tx || this.databaseService;

    await db.verification.updateMany({
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
    });

    const newVerification = await db.verification.create({
      data: {
        expiredAt,
        reference,
        token: hashedToken,
        type,
        to: userEmail,
        userId,
        createdBy: userId,
        createdAt: today,
      },
    });

    return VerificationMapper.toDomain(newVerification);
  }
}
