import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { HelperService } from '@/common/helper/services/helper.service';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { PasswordHistoryModel } from '../models/password-history.model';
import { PasswordHistoryMapper } from '../mappers/password-history.mapper';
import {
  Prisma,
  PasswordHistory as PrismaPasswordHistory,
} from '@/generated/prisma-client';

@Injectable()
export class PasswordHistoryRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly helperService: HelperService
  ) {}

  async findWithPaginationOffsetByAdmin(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryOffsetParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationOffsetReturn<PasswordHistoryModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaPasswordHistory,
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >(this.databaseService.passwordHistory, {
      ...others,
      where: {
        ...where,
        userId,
      },
      include: {
        user: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        PasswordHistoryMapper.toDomain(item as any)
      ),
    };
  }

  async findWithPaginationCursor(
    userId: string,
    {
      where,
      ...others
    }: IPaginationQueryCursorParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationCursorReturn<PasswordHistoryModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaPasswordHistory,
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >(this.databaseService.passwordHistory, {
      ...others,
      where: {
        ...where,
        userId,
      },
      include: {
        user: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        PasswordHistoryMapper.toDomain(item as any)
      ),
    };
  }

  async findActiveUser(userId: string): Promise<PasswordHistoryModel[]> {
    const today = this.helperService.dateCreate();
    const results = await this.databaseService.passwordHistory.findMany({
      where: {
        userId,
        expiredAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });
    return results.map(item => PasswordHistoryMapper.toDomain(item as any));
  }
}
