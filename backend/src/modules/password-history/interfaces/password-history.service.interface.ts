import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PasswordHistoryModel } from '../models/password-history.model';
import { Prisma } from '@/generated/prisma-client';

export interface IPasswordHistoryService {
  getListOffsetByAdmin(
    userId: string,
    pagination: IPaginationQueryOffsetParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationOffsetReturn<PasswordHistoryModel>>;

  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.PasswordHistorySelect,
      Prisma.PasswordHistoryWhereInput
    >
  ): Promise<IPaginationCursorReturn<PasswordHistoryModel>>;
}
