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
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';
import { RoleAbilitiesResponseDto } from '@/modules/role/dtos/response/role.abilities.response.dto';
import { RoleAbilityDto } from '@/modules/role/dtos/role.ability.dto';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { EnumRoleType } from '../enums/role.enum';
import { RoleModel } from '../models/role.model';
import { Prisma } from '@/generated/prisma-client';

export interface IRoleService {
  getListOffsetByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.RoleSelect, Prisma.RoleWhereInput>,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<RoleModel>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<RoleModel>>;
  getOne(id: string): Promise<IResponseReturn<RoleDto>>;
  getAbilities(id: string): Promise<IResponseReturn<RoleAbilitiesResponseDto>>;
  createByAdmin(
    data: RoleCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<RoleModel>>;
  updateByAdmin(
    id: string,
    data: RoleUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<RoleModel>>;
  deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>>;
  validateRoleGuard(
    request: IRequestApp,
    requiredRoles: EnumRoleType[]
  ): Promise<RoleAbilityDto[]>;
}
