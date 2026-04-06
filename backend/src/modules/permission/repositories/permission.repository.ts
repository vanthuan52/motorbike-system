import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { IPermissionListFilters } from '@/modules/permission/interfaces/permission.filter.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionModel } from '@/modules/permission/models/permission.model';
import { PermissionMapper } from '@/modules/permission/mappers/permission.mapper';
import {
  Prisma,
  Permission as PrismaPermission,
} from '@/generated/prisma-client';

@Injectable()
export class PermissionRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffsetByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    filters?: IPermissionListFilters
  ): Promise<IPaginationOffsetReturn<PermissionModel>> {
    const result = await this.paginationService.offset<
      PrismaPermission,
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >(this.databaseService.permission, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
    });

    return {
      ...result,
      data: result.data.map(PermissionMapper.toDomain),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    filters?: IPermissionListFilters
  ): Promise<IPaginationCursorReturn<PermissionModel>> {
    const result = await this.paginationService.cursor<
      PrismaPermission,
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >(this.databaseService.permission, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
    });

    return {
      ...result,
      data: result.data.map(PermissionMapper.toDomain),
    };
  }

  async findOneById(id: string): Promise<PermissionModel | null> {
    const result = await this.databaseService.permission.findUnique({
      where: { id },
    });

    return result ? PermissionMapper.toDomain(result) : null;
  }

  async findByIds(ids: string[]): Promise<PermissionModel[]> {
    const results = await this.databaseService.permission.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
    });

    return results.map(PermissionMapper.toDomain);
  }

  async findByRoleId(roleId: string): Promise<PermissionModel[]> {
    const rolePermissions = await this.databaseService.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });

    return rolePermissions.map((rp: any) =>
      PermissionMapper.toDomain(rp.permission)
    );
  }

  async findByRoleIds(roleIds: string[]): Promise<PermissionModel[]> {
    const rolePermissions = await this.databaseService.rolePermission.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: { permission: true },
    });

    // Deduplicate permissions (user may have overlapping role permissions)
    const permMap = new Map<string, PermissionModel>();
    for (const rp of rolePermissions) {
      if (!permMap.has(rp.permission.id)) {
        permMap.set(rp.permission.id, PermissionMapper.toDomain(rp.permission));
      }
    }

    return Array.from(permMap.values());
  }

  async existByCode(code: string): Promise<PermissionModel | null> {
    const result = await this.databaseService.permission.findUnique({
      where: { code },
    });

    return result ? PermissionMapper.toDomain(result) : null;
  }

  async existByName(name: string): Promise<PermissionModel | null> {
    const result = await this.databaseService.permission.findFirst({
      where: { name },
    });

    return result ? PermissionMapper.toDomain(result) : null;
  }

  async existById(id: string): Promise<PermissionModel | null> {
    const result = await this.databaseService.permission.findUnique({
      where: { id },
      select: { id: true, name: true, code: true },
    });

    return result ? (result as unknown as PermissionModel) : null;
  }

  async create(data: PermissionCreateRequestDto): Promise<PermissionModel> {
    const result = await this.databaseService.permission.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        group: data.group,
        action: data.action.toUpperCase() as any,
        subject: data.subject.toUpperCase() as any,
      },
    });

    return PermissionMapper.toDomain(result);
  }

  async update(
    id: string,
    data: PermissionUpdateRequestDto
  ): Promise<PermissionModel> {
    const result = await this.databaseService.permission.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return PermissionMapper.toDomain(result);
  }

  async delete(id: string): Promise<PermissionModel> {
    const result = await this.databaseService.permission.delete({
      where: { id },
    });

    return PermissionMapper.toDomain(result);
  }
}
