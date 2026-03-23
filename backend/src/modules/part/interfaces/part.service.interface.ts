import { Part, Prisma } from '@/generated/prisma-client';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IPartService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartSelect,
      Prisma.PartWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: Part[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartSelect,
      Prisma.PartWhereInput
    >,
    status?: Record<string, IPaginationIn>,
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: Part[]; total?: number }>;

  findOneById(partId: string): Promise<Part>;

  findOneWithRelationsById(partId: string): Promise<Part>;

  findOneBySlug(slug: string): Promise<Part>;

  create(payload: PartCreateRequestDto): Promise<{ id: string }>;

  update(partId: string, payload: PartUpdateRequestDto): Promise<void>;

  updateStatus(
    partId: string,
    payload: PartUpdateStatusRequestDto,
  ): Promise<void>;

  delete(partId: string): Promise<void>;
}
