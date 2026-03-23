import { PartType, Prisma } from '@/generated/prisma-client';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';

export interface IPartTypeService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<{ data: PartType[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    status?: Record<string, IPaginationIn>
  ): Promise<{ data: PartType[]; total?: number }>;

  findOneById(partTypeId: string): Promise<PartType>;

  findOneBySlug(slug: string): Promise<PartType>;

  create(payload: PartTypeCreateRequestDto): Promise<{ id: string }>;

  update(partTypeId: string, payload: PartTypeUpdateRequestDto): Promise<void>;

  updateStatus(
    partTypeId: string,
    payload: PartTypeUpdateStatusRequestDto
  ): Promise<void>;

  delete(partTypeId: string): Promise<void>;
}
