import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Document } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IRoleService } from '../interfaces/role.service.interface';
import { RoleRepository } from '../repositories/role.repository';
import {
  IDatabaseCreateManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  IPaginationIn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { DatabaseHelperQueryContain } from '@/common/database/decorators/database.decorator';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleDto } from '../dtos/role.dto';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { RoleAbilityDto } from '../dtos/role.ability.dto';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { EnumRoleStatusCodeError } from '../enums/role.status-code.enum';
import { RoleUtil } from '../utils/role.util';
import { RoleAbilitiesResponseDto } from '../dtos/response/role.abilities.response.dto';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleUtil: RoleUtil,
  ) {}

  /**
   * Retrieves a paginated list of roles using offset-based pagination.
   */
  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...type,
    };

    const [roles, total] = await Promise.all([
      this.roleRepository.findAll(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.roleRepository.getTotal(find),
    ]);

    const mapped = this.roleUtil.mapList(roles);
    const totalPage = Math.ceil(total / limit);
    const page = Math.floor(skip / limit) + 1;
    const hasNext = page < totalPage;
    const hasPrevious = page > 1;

    return {
      type: EnumPaginationType.offset,
      count: total,
      perPage: limit,
      page,
      totalPage,
      hasNext,
      hasPrevious,
      nextPage: hasNext ? page + 1 : undefined,
      previousPage: hasPrevious ? page - 1 : undefined,
      data: mapped,
    };
  }

  /**
   * Get paginated list of roles with cursor pagination
   */
  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams,
    type?: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    const find: Record<string, any> = {
      ...where,
      ...type,
    };

    const [data, count] = await Promise.all([
      this.roleRepository.findAllCursor(find, {
        cursor: {
          cursor,
          cursorField,
          limit: limit + 1,
          order: orderBy,
        },
      }),
      includeCount
        ? this.roleRepository.getTotal(find)
        : Promise.resolve(undefined),
    ]);

    // Calculate cursor pagination metadata
    const hasNext = data.length > limit;
    const items = hasNext ? data.slice(0, limit) : data;
    const nextCursor =
      hasNext && items.length > 0 && cursorField
        ? String((items[items.length - 1] as any)[cursorField])
        : undefined;
    const mapped = this.roleUtil.mapList(items);

    return {
      type: EnumPaginationType.cursor,
      count,
      perPage: limit,
      hasNext,
      cursor: nextCursor,
      data: mapped,
    };
  }

  async findOneById(id: string): Promise<RoleDoc> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    return role;
  }

  async getAbilities(id: string): Promise<RoleAbilitiesResponseDto> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    return this.roleUtil.mapAbilities(role);
  }

  async create(data: RoleCreateRequestDto): Promise<RoleDoc> {
    const exist: boolean = await this.roleRepository.existByName(data.name);
    if (exist) {
      throw new ConflictException({
        statusCode: EnumRoleStatusCodeError.exist,
        message: 'role.error.exist',
      });
    }

    const { name, description, type, abilities } = data;
    const create: RoleEntity = new RoleEntity();
    create.name = name;
    create.description = description;
    create.type = type;
    create.abilities = abilities;
    create.isActive = true;

    const role = await this.roleRepository.create<RoleEntity>(create);

    return role;
  }

  async update(id: string, data: RoleUpdateRequestDto): Promise<RoleDoc> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    const { abilities, type, description } = data;
    role.description = description;
    role.type = type;
    role.abilities = abilities;

    const updated = await this.roleRepository.save(role);

    return updated;
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    await this.roleRepository.delete({ _id: role._id });

    return;
  }

  async validateRoleGuard(
    request: IRequestApp,
    requiredRoles: EnumRoleType[],
  ): Promise<RoleAbilityDto[]> {
    const { __user, user } = request;
    if (!__user || !user) {
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    const { role } = __user;

    if (role.type === EnumRoleType.superAdmin) {
      return [];
    } else if (requiredRoles.length === 0) {
      throw new InternalServerErrorException({
        statusCode: EnumRoleStatusCodeError.predefinedNotFound,
        message: 'role.error.predefinedNotFound',
      });
    } else if (!requiredRoles.includes(role.type)) {
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.forbidden,
        message: 'role.error.forbidden',
      });
    }

    return this.roleUtil.mapOne(__user.role).abilities;
  }

  async findOneByName(name: string): Promise<RoleDto> {
    const role = await this.roleRepository.findOne<RoleDoc>({ name });
    if (!role) return null;
    return this.roleUtil.mapOne(role);
  }
}
