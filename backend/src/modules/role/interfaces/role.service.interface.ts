import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IRequestApp,
  IRequestLog,
} from '@/common/request/interfaces/request.interface';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';
import { RoleModel } from '../models/role.model';
import { PermissionModel } from '@/modules/permission/models/permission.model';
import { Prisma } from '@/generated/prisma-client';

export interface IRoleService {
  getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<RoleModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<RoleModel>>;

  getOne(id: string): Promise<RoleModel>;

  getPermissions(id: string): Promise<PermissionModel[]>;

  createByAdmin(
    data: RoleCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<RoleModel>;

  updateByAdmin(
    id: string,
    data: RoleUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<RoleModel>;

  deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<RoleModel>;

  validateRoleGuard(
    request: IRequestApp,
    requiredRoles: string[]
  ): Promise<PermissionModel[]>;

  findRoleByName(name: string): Promise<RoleModel | null>;
}
