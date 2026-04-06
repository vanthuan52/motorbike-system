import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPartListFilters } from './part.filter.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartModel } from '../models/part.model';
import { Prisma } from '@/generated/prisma-client';

export interface IPartService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartSelect,
      Prisma.PartWhereInput
    >,
    filters?: IPartListFilters
  ): Promise<IPaginationOffsetReturn<PartModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartSelect,
      Prisma.PartWhereInput
    >,
    filters?: IPartListFilters
  ): Promise<IPaginationCursorReturn<PartModel>>;

  findOneById(partId: string): Promise<PartModel>;

  findOneWithRelationsById(partId: string): Promise<PartModel>;

  findOneBySlug(slug: string): Promise<PartModel>;

  create(
    payload: PartCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }>;

  update(
    partId: string,
    payload: PartUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  updateStatus(
    partId: string,
    payload: PartUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  delete(
    partId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;
}
