import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';
import { EnumPermissionType, Prisma } from '@/generated/prisma-client';

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
  ): Promise<IPaginationOffsetReturn<Permission>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<Permission>>;
  getOne(id: string): Promise<IResponseReturn<PermissionDto>>;
  createByAdmin(
    data: PermissionCreateRequestDto
  ): Promise<IResponseReturn<PermissionDto>>;
  updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto
  ): Promise<IResponseReturn<PermissionDto>>;
  deleteByAdmin(id: string): Promise<IResponseReturn<void>>;
}
