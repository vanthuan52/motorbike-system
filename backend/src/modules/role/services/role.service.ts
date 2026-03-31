import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';
import { EnumRoleStatusCodeError } from '@/modules/role/enums/role.status-code.enum';
import { IRoleService } from '@/modules/role/interfaces/role.service.interface';
import { RoleRepository } from '@/modules/role/repositories/role.repository';
import { RoleModel } from '../models/role.model';
import { PermissionService } from '@/modules/permission/services/permission.service';
import { PermissionModel } from '@/modules/permission/models/permission.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class RoleService implements IRoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionService: PermissionService
  ) {}

  async getListOffsetByAdmin(
    pagination: IPaginationQueryOffsetParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<RoleModel>> {
    return this.roleRepository.findWithPaginationOffsetByAdmin(
      pagination,
      type
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    type?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<RoleModel>> {
    return this.roleRepository.findWithPaginationCursor(pagination, type);
  }

  async getOne(id: string): Promise<RoleModel> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    return role;
  }

  async getPermissions(id: string): Promise<PermissionModel[]> {
    const role = await this.roleRepository.findOneById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    return this.permissionService.findByRoleIds([id]);
  }

  async createByAdmin(
    { name, permissionIds, ...others }: RoleCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<RoleModel> {
    const exist = await this.roleRepository.existByName(name);
    if (exist) {
      throw new ConflictException({
        statusCode: EnumRoleStatusCodeError.exist,
        message: 'role.error.exist',
      });
    }

    return this.roleRepository.create({
      name,
      permissionIds,
      ...others,
      createdBy,
    });
  }

  async updateByAdmin(
    id: string,
    { permissionIds, ...data }: RoleUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<RoleModel> {
    const role = await this.roleRepository.existById(id);
    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    }

    const updated = await this.roleRepository.update(id, {
      ...data,
      updatedBy,
    });

    // Sync permissions if provided
    if (permissionIds) {
      await this.roleRepository.syncPermissions(id, permissionIds, updatedBy);
    }

    return updated;
  }

  async deleteByAdmin(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<RoleModel> {
    const [role, roleUsed] = await Promise.all([
      this.roleRepository.existById(id),
      this.roleRepository.used(id),
    ]);

    if (!role) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.notFound,
        message: 'role.error.notFound',
      });
    } else if (roleUsed) {
      throw new ConflictException({
        statusCode: EnumRoleStatusCodeError.used,
        message: 'role.error.used',
      });
    }

    return this.roleRepository.update(id, {
      deletedAt: new Date(),
      deletedBy,
    });
  }

  async validateRoleGuard(
    request: IRequestApp,
    requiredRoles: string[]
  ): Promise<PermissionModel[]> {
    const { __user, user } = request;
    if (!__user || !user) {
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    const { roles } = __user;

    // We no longer bypass SuperAdmin as all users should have explicit permissions.
    // If you still want to bypass it, you can check roles?.some(r => r.name === 'superadmin')
    // but the user's preference is "phải có permission tường minh".

    if (requiredRoles.length > 0) {
      // Check if user has any of the required roles (by name or type string)
      const hasRequiredRole = roles?.some((r) =>
        requiredRoles.includes(r.type) || requiredRoles.includes(r.name)
      );

      if (!hasRequiredRole) {
        throw new ForbiddenException({
          statusCode: EnumRoleStatusCodeError.forbidden,
          message: 'role.error.forbidden',
        });
      }
    }

    // Get permissions from all user roles
    const roleIds = roles?.map((r) => r.id) ?? [];
    return this.permissionService.findByRoleIds(roleIds);
  }

  /* ======================== Service to Service call ============================== */
  async findRoleByName(name: string): Promise<RoleModel | null> {
    return this.roleRepository.existByName(name);
  }
}
