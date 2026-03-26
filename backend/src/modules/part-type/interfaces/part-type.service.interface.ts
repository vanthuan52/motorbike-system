import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PartType, Prisma } from '@/generated/prisma-client';

export interface IPartTypeService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >
  ): Promise<IPaginationOffsetReturn<PartType>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >
  ): Promise<IPaginationCursorReturn<PartType>>;

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
