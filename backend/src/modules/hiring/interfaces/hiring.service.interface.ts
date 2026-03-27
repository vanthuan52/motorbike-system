import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { HiringUpdateStatusRequestDto } from '../dtos/request/hiring.update-status.request.dto';
import { HiringModel } from '../models/hiring.model';
import { Prisma } from '@/generated/prisma-client';

export interface IHiringService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<HiringModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.HiringSelect,
      Prisma.HiringWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<HiringModel>>;

  findOneById(id: string): Promise<HiringModel | null>;

  findOne(where: Prisma.HiringWhereInput): Promise<HiringModel | null>;

  create(payload: HiringCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: HiringUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: HiringUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  createSlug(name: string): string;
}
