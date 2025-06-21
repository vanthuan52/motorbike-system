import {
  IDatabaseCreateManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleGetResponseDto } from '../dtos/response/role.get.response.dto';
import { RoleShortResponseDto } from '../dtos/response/role.short.response.dto';

export interface IRoleService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]>;
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]>;

  getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<number>;

  findAllActiveByType(
    type: ENUM_POLICY_ROLE_TYPE,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]>;

  findAllByTypes(
    types: ENUM_POLICY_ROLE_TYPE[],
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]>;

  findOneById(_id: string, options?: IDatabaseOptions): Promise<RoleDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null>;

  findOneByName(
    name: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null>;

  findOneByType(
    type: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null>;

  findOneActiveById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;
  create(
    { name, description, type, permissions }: RoleCreateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;

  update(
    repository: RoleDoc,
    { permissions, type, description }: RoleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;

  active(repository: RoleDoc, options?: IDatabaseSaveOptions): Promise<RoleDoc>;
  inactive(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc>;

  delete(
    repository: RoleDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean>;
  createMany(
    data: RoleCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;
  mapList(roles: RoleDoc[] | RoleEntity[]): RoleListResponseDto[];
  mapGet(role: RoleDoc | RoleEntity): RoleGetResponseDto;
  mapShort(roles: RoleDoc[] | RoleEntity[]): RoleShortResponseDto[];
}
