import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { PermissionModel } from '../models/permission.model';
import { Prisma } from '@/generated/prisma-client';

export interface IPermissionService {
  getListOffsetByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<PermissionModel>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<PermissionModel>>;
  getOne(id: string): Promise<IResponseReturn<PermissionDto>>;
  createByAdmin(
    data: PermissionCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<PermissionDto>>;
  updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<PermissionDto>>;
  deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>>;
}
