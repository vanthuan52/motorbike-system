import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationIn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';
import { RoleModel } from '@/modules/role/models/role.model';
import { RoleMapper } from '@/modules/role/mappers/role.mapper';
import { Prisma, Role } from '@/generated/prisma-client';

@Injectable()
export class RoleRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffsetByAdmin(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.RoleSelect, Prisma.RoleWhereInput>,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<RoleModel>> {
    const result = await this.paginationService.offset<
      Role,
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >(this.databaseService.role, {
      ...params,
      where: {
        ...where,
        ...type,
      },
    });

    return {
      ...result,
      data: result.data.map(RoleMapper.toDomain),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<Prisma.RoleSelect, Prisma.RoleWhereInput>,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<RoleModel>> {
    const result = await this.paginationService.cursor<
      Role,
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >(this.databaseService.role, {
      ...params,
      where: {
        ...where,
        ...type,
      },
    });

    return {
      ...result,
      data: result.data.map(RoleMapper.toDomain),
    };
  }

  async findOneById(id: string): Promise<RoleModel | null> {
    const result = await this.databaseService.role.findUnique({
      where: { id },
    });

    return result ? RoleMapper.toDomain(result) : null;
  }

  async existByType(type: string): Promise<RoleModel | null> {
    const result = await this.databaseService.role.findFirst({
      where: { type },
      select: { id: true, type: true, name: true },
    });

    return result ? (result as unknown as RoleModel) : null;
  }

  async existById(id: string): Promise<RoleModel | null> {
    const result = await this.databaseService.role.findUnique({
      where: { id },
      select: { id: true, type: true, name: true },
    });

    return result ? (result as unknown as RoleModel) : null;
  }

  async used(id: string): Promise<{ id: string } | null> {
    const userRole = await this.databaseService.userRole.findFirst({
      where: { roleId: id },
      select: { id: true },
    });

    return userRole;
  }

  async create({
    name,
    permissionIds,
    ...others
  }: RoleCreateRequestDto & { createdBy: string }): Promise<RoleModel> {
    const result = await this.databaseService.role.create({
      data: {
        name,
        ...others,
        ...(permissionIds?.length && {
          rolePermissions: {
            createMany: {
              data: permissionIds.map(permissionId => ({
                permissionId,
              })),
            },
          },
        }),
      },
    });

    return RoleMapper.toDomain(result);
  }

  async update(
    id: string,
    {
      permissionIds,
      ...others
    }: Partial<RoleUpdateRequestDto> & {
      updatedBy?: string;
      deletedBy?: string;
      deletedAt?: Date;
    }
  ): Promise<RoleModel> {
    const result = await this.databaseService.role.update({
      where: { id },
      data: {
        ...others,
      },
    });

    return RoleMapper.toDomain(result);
  }

  async delete(id: string): Promise<RoleModel> {
    // Delete role permissions first
    await this.databaseService.rolePermission.deleteMany({
      where: { roleId: id },
    });

    const result = await this.databaseService.role.delete({
      where: { id },
    });

    return RoleMapper.toDomain(result);
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy?: string
  ): Promise<void> {
    await this.databaseService.rolePermission.createMany({
      data: permissionIds.map(permissionId => ({
        roleId,
        permissionId,
        assignedBy,
      })),
      skipDuplicates: true,
    });
  }

  async revokePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<void> {
    await this.databaseService.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId: { in: permissionIds },
      },
    });
  }

  async syncPermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy?: string
  ): Promise<void> {
    await this.databaseService.$transaction([
      this.databaseService.rolePermission.deleteMany({
        where: { roleId },
      }),
      this.databaseService.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({
          roleId,
          permissionId,
          assignedBy,
        })),
      }),
    ]);
  }

  async findRoleIdsByUserId(userId: string): Promise<string[]> {
    const userRoles = await this.databaseService.userRole.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      select: { roleId: true },
    });

    return userRoles.map(ur => ur.roleId);
  }
}
