import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPartTypeListFilters } from './part-type.filter.interface';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartTypeModel } from '../models/part-type.model';
import { Prisma } from '@/generated/prisma-client';

export interface IPartTypeService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationCursorReturn<PartTypeModel>>;

  findOneById(id: string): Promise<PartTypeModel>;

  findOneBySlug(slug: string): Promise<PartTypeModel>;

  create(
    payload: PartTypeCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<PartTypeModel>;

  update(
    id: string,
    payload: PartTypeUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PartTypeModel>;

  updateStatus(
    id: string,
    payload: PartTypeUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PartTypeModel>;

  delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PartTypeModel>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >,
    filters?: IPartTypeListFilters
  ): Promise<IPaginationOffsetReturn<PartTypeModel>>;

  restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<PartTypeModel>;

  forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PartTypeModel>;
}
