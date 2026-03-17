import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleAbilityDto } from '../dtos/role.ability.dto';
import { RoleDto } from '../dtos/role.dto';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { RoleAbilitiesResponseDto } from '../dtos/response/role.abilities.response.dto';
import { RoleDoc } from '../entities/role.entity';

export interface IRoleService {
  getListOffset(
    { where, ...params }: IPaginationQueryOffsetParams,
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>>;
  getListCursor(
    pagination: IPaginationQueryCursorParams,
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>>;
  findOneById(id: string): Promise<RoleDoc>;
  getAbilities(id: string): Promise<RoleAbilitiesResponseDto>;
  create(data: RoleCreateRequestDto): Promise<RoleDoc>;
  update(id: string, data: RoleUpdateRequestDto): Promise<RoleDoc>;
  delete(id: string): Promise<void>;
  validateRoleGuard(
    request: IRequestApp,
    requiredRoles: EnumRoleType[],
  ): Promise<RoleAbilityDto[]>;
  findOneByName(name: string): Promise<RoleDto>;
}
