import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionModel } from '../models/permission.model';
import { Prisma } from '@/generated/prisma-client';

export interface IPermissionService {
  getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    group?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<PermissionModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    group?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<PermissionModel>>;

  getOne(id: string): Promise<PermissionModel>;

  createByAdmin(
    data: PermissionCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<PermissionModel>;

  updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PermissionModel>;

  deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PermissionModel>;

  findByIds(ids: string[]): Promise<PermissionModel[]>;

  findByRoleIds(roleIds: string[]): Promise<PermissionModel[]>;
}
