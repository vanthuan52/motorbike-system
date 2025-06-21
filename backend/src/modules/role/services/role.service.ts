import { Injectable } from '@nestjs/common';
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
import { RoleDoc, RoleEntity } from '../entities/role.entity';
import { ENUM_POLICY_ROLE_TYPE } from '@/modules/policy/enums/policy.enum';
import { DatabaseHelperQueryContain } from '@/common/database/decorators/database.decorator';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleGetResponseDto } from '../dtos/response/role.get.response.dto';
import { RoleShortResponseDto } from '../dtos/response/role.short.response.dto';

@Injectable()
export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

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
    type: ENUM_POLICY_ROLE_TYPE,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDoc[]> {
    return this.roleRepository.findAll({ type, isActive: true }, options);
  }

  async findAllByTypes(
    types: ENUM_POLICY_ROLE_TYPE[],
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
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOneById(_id, options);
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
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<RoleDoc | null> {
    return this.roleRepository.findOne({ _id, isActive: true }, options);
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

  async create(
    { name, description, type, permissions }: RoleCreateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    const create: RoleEntity = new RoleEntity();
    create.name = name;
    create.description = description;
    create.type = type;
    create.permissions = permissions;
    create.isActive = true;

    return this.roleRepository.create<RoleEntity>(create, options);
  }

  async update(
    repository: RoleDoc,
    { permissions, type, description }: RoleUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<RoleDoc> {
    repository.description = description;
    repository.type = type;
    repository.permissions = permissions;

    return this.roleRepository.save(repository, options);
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

  async delete(
    repository: RoleDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<boolean> {
    await this.roleRepository.delete({ _id: repository._id }, options);

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
    const create: RoleEntity[] = data.map(({ type, name, permissions }) => {
      const entity: RoleEntity = new RoleEntity();
      entity.type = type;
      entity.isActive = true;
      entity.name = name;
      entity.permissions = permissions;

      return entity;
    }) as RoleEntity[];

    await this.roleRepository.createMany<RoleEntity>(create, options);

    return true;
  }

  mapList(roles: RoleDoc[] | RoleEntity[]): RoleListResponseDto[] {
    return plainToInstance(
      RoleListResponseDto,
      roles.map((e: RoleDoc | RoleEntity) =>
        e instanceof Document ? e.toObject() : e,
      ),
    );
  }

  mapGet(role: RoleDoc | RoleEntity): RoleGetResponseDto {
    return plainToInstance(
      RoleGetResponseDto,
      role instanceof Document ? role.toObject() : role,
    );
  }

  mapShort(roles: RoleDoc[] | RoleEntity[]): RoleShortResponseDto[] {
    return plainToInstance(
      RoleShortResponseDto,
      roles.map((e: RoleDoc | RoleEntity) =>
        e instanceof Document ? e.toObject() : e,
      ),
    );
  }
}
