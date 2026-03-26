import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { DatabaseUtil } from '@/common/database/utils/database.util';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { IPermission } from '@/modules/permission/interfaces/permission.interface';

@Injectable()
export class PermissionRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService,
    private readonly databaseUtil: DatabaseUtil
  ) {}

  async findWithPaginationOffsetByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<Permission>> {
    return this.paginationService.offset<
      Permission,
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >(this.databaseService.permission, {
      ...params,
      where: {
        ...where,
        ...type,
      },
    });
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<Permission>> {
    return this.paginationService.cursor<
      Permission,
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >(this.databaseService.permission, {
      ...params,
      where: {
        ...where,
        ...type,
      },
    });
  }

  async findOneById(id: string): Promise<Permission> {
    return this.databaseService.permission.findUnique({
      where: { id },
    });
  }

  async existByName(name: string): Promise<IPermission | null> {
    return this.databaseService.permission.findFirst({
      where: {
        name: name,
      },
      select: { id: true, type: true, name: true },
    });
  }

  async existById(id: string): Promise<IPermission | null> {
    return this.databaseService.permission.findUnique({
      where: {
        id,
      },
      select: { id: true, type: true, name: true },
    });
  }

  async used(id: string): Promise<{ id: string } | null> {
    return this.databaseService.permission.findFirst({
      where: {
        users: {
          some: {
            roleId: id,
          },
        },
      },
      select: { id: true },
    });
  }

  async create({
    name,
    abilities,
    ...others
  }: PermissionCreateRequestDto): Promise<Permission> {
    return this.databaseService.permission.create({
      data: {
        name: name,
        abilities: this.databaseUtil.toPlainArray(abilities),
        ...others,
      },
    });
  }

  async update(
    id: string,
    { abilities, ...others }: PermissionUpdateRequestDto
  ): Promise<Permission> {
    return this.databaseService.permission.update({
      where: { id },
      data: {
        abilities: this.databaseUtil.toPlainArray(abilities),
        ...others,
      },
    });
  }

  async delete(id: string): Promise<Permission> {
    return this.databaseService.permission.delete({ where: { id } });
  }
}
