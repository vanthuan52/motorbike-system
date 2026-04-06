import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPermissionListFilters } from '@/modules/permission/interfaces/permission.filter.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { EnumPermissionStatusCodeError } from '@/modules/permission/enums/permission.status-code.enum';
import { IPermissionService } from '@/modules/permission/interfaces/permission.service.interface';
import { PermissionRepository } from '@/modules/permission/repositories/permission.repository';
import { PermissionModel } from '../models/permission.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class PermissionService implements IPermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    filters?: IPermissionListFilters
  ): Promise<IPaginationOffsetReturn<PermissionModel>> {
    return this.permissionRepository.findWithPaginationOffsetByAdmin(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    filters?: IPermissionListFilters
  ): Promise<IPaginationCursorReturn<PermissionModel>> {
    return this.permissionRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async getOne(id: string): Promise<PermissionModel> {
    const permission = await this.permissionRepository.findOneById(id);
    if (!permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'permission.error.notFound',
      });
    }

    return permission;
  }

  async createByAdmin(
    data: PermissionCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<PermissionModel> {
    const existByCode = await this.permissionRepository.existByCode(data.code);
    if (existByCode) {
      throw new ConflictException({
        statusCode: EnumPermissionStatusCodeError.exist,
        message: 'permission.error.codeExist',
      });
    }

    const existByName = await this.permissionRepository.existByName(data.name);
    if (existByName) {
      throw new ConflictException({
        statusCode: EnumPermissionStatusCodeError.exist,
        message: 'permission.error.nameExist',
      });
    }

    return this.permissionRepository.create(data);
  }

  async updateByAdmin(
    id: string,
    data: PermissionUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<PermissionModel> {
    const permission = await this.permissionRepository.existById(id);
    if (!permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'permission.error.notFound',
      });
    }

    return this.permissionRepository.update(id, data);
  }

  async deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<PermissionModel> {
    const permission = await this.permissionRepository.existById(id);
    if (!permission) {
      throw new NotFoundException({
        statusCode: EnumPermissionStatusCodeError.notFound,
        message: 'permission.error.notFound',
      });
    }

    return this.permissionRepository.delete(id);
  }

  async findByIds(ids: string[]): Promise<PermissionModel[]> {
    return this.permissionRepository.findByIds(ids);
  }

  async findByRoleIds(roleIds: string[]): Promise<PermissionModel[]> {
    return this.permissionRepository.findByRoleIds(roleIds);
  }
}
