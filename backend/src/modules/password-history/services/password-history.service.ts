import { Injectable } from '@nestjs/common';
import { IPasswordHistoryService } from '../interfaces/password-history.service.interface';
import { PasswordHistoryRepository } from '../repositories/password-history.repository';
import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PasswordHistoryModel } from '../models/password-history.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class PasswordHistoryService implements IPasswordHistoryService {
  constructor(
    private readonly passwordHistoryRepository: PasswordHistoryRepository
  ) {}

  async getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationOffsetReturn<PasswordHistoryModel>> {
    const { data, ...others } =
      await this.passwordHistoryRepository.findWithPaginationOffsetByAdmin(
        userId,
        pagination
      );

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationCursorReturn<PasswordHistoryModel>> {
    const { data, ...others } =
      await this.passwordHistoryRepository.findWithPaginationCursor(
        userId,
        pagination
      );

    return {
      data,
      ...others,
    };
  }
}
