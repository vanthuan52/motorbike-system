import {
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

class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly roleUtil: RoleUtil,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]> {
    return this.roleRepository.findAll(find, options);
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.roleRepository.getTotal(find, options);
  }

  async findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]> {
    return this.roleRepository.findAll(
      {
        ...find,
        isActive: true,
      },
      options,
    );
  }

  getTotalActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<number> {
    return this.roleRepository.getTotal(
      {
        ...find,
        isActive: true,
      },
      options,
    );
  }

  async findAllActiveByType(
    type: EnumRoleType,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]> {
    return this.roleRepository.findAll({ type, isActive: true }, options);
  }

  async findAllByTypes(
    types: EnumRoleType[],
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]> {
    return this.roleRepository.findAll(
      {
        type: {
          $in: types,
        },
      },
      options,
    );
  }

  async findOneById(
    id: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOneById(id, options);
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOne(find, options);
  }

  async findOneByName(
    name: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOne(
      DatabaseHelperQueryContain('name', name, { fullWord: true }),
      options,
    );
  }

  async findOneByType(
    type: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOne(
      DatabaseHelperQueryContain('type', type, { fullWord: true }),
      options,
    );
  }

  async findOneActiveById(
    id: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOne({ id, isActive: true }, options);
  }

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    return this.roleRepository.exists(
      DatabaseHelperQueryContain('name', name, { fullWord: true }),
      options,
    );
  }

  async active(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.isActive = true;

    return this.roleRepository.save(repository, options);
  }

  async inactive(
    repository: RoleDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.isActive = false;
    return this.roleRepository.save(repository, options);
  }

  async deleteRole(
    repository: RoleDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean> {
    await this.roleRepository.delete({ id: repository._id }, options);

    return true;
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean> {
    await this.roleRepository.deleteMany(find, options);

    return true;
  }

  async createMany(
    data: RoleCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create: RoleEntity[] = data.map(({ type, name, abilities }) => {
      const entity: RoleEntity = new RoleEntity();
      entity.type = type;
      entity.isActive = true;
      entity.name = name;
      entity.abilities = abilities;

      return entity;
    }) as RoleEntity[];

    await this.roleRepository.createMany<RoleEntity>(create, options);

    return true;
  }
}
