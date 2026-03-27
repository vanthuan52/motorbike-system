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
import { Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PartTypeModel } from '../models/part-type.model';

export interface IPartTypeService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >
  ): Promise<IPaginationOffsetReturn<PartTypeModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PartTypeSelect,
      Prisma.PartTypeWhereInput
    >
  ): Promise<IPaginationCursorReturn<PartTypeModel>>;

  findOneById(partTypeId: string): Promise<PartTypeModel>;

  findOneBySlug(slug: string): Promise<PartTypeModel>;

  create(
    payload: PartTypeCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<{ id: string }>;

  update(
    partTypeId: string,
    payload: PartTypeUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  updateStatus(
    partTypeId: string,
    payload: PartTypeUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  delete(
    partTypeId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;
}
