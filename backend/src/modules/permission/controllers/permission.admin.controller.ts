import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { Response } from '@/common/response/decorators/response.decorator';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import { RoleService } from '@/modules/role/services/role.service';
import {
  RoleAdminCreateDoc,
  RoleAdminDeleteDoc,
  RoleAdminGetDoc,
  RoleAdminListDoc,
  RoleAdminUpdateDoc,
} from '@/modules/role/docs/role.admin.doc';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { RoleCreateRequestDto } from '@/modules/role/dtos/request/role.create.request.dto';
import { RoleUpdateRequestDto } from '@/modules/role/dtos/request/role.update.request.dto';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';

import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  RoleDefaultAvailableSearch,
  RoleDefaultType,
} from '@/modules/role/constants/role.list.constant';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import {
  EnumActivityLogAction,
  EnumRoleType,
  Prisma,
} from '/@generated/prisma-client';
import { PermissionAdminListDoc } from '../docs/permission.admin.doc';
import { PermissionUtil } from '../utils/permission.util';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionService } from '../services/permission.service';

@ApiTags('modules.admin.permission')
@Controller({
  version: '1',
  path: '/permission',
})
export class PermissionAdminController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly permissionUtil: PermissionUtil
  ) {}

  @PermissionAdminListDoc()
  @Response('permission.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: RoleDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    @PaginationQueryFilterInEnum<EnumRoleType>('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PermissionListResponseDto>> {
    const result = await this.permissionService.getListOffsetByAdmin(pagination, type);
    const mapped = this.permissionUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @PermissionAdminGetDoc()
  @Response('permission.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/get/:roleId')
  async get(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string
  ): Promise<IResponseReturn<RoleDto>> {
    return this.permissionService.getOne(roleId);
  }

  @RoleAdminCreateDoc()
  @Response('role.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
  @ActivityLog(EnumActivityLogAction.adminRoleCreate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/create')
  async create(
    @Body()
    body: RoleCreateRequestDto
  ): Promise<IResponseReturn<RoleDto>> {
    return this.permissionService.createByAdmin(body);
  }

  @RoleAdminUpdateDoc()
  @Response('role.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
  @ActivityLog(EnumActivityLogAction.adminRoleUpdate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:roleId')
  async update(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string,
    @Body()
    body: RoleUpdateRequestDto
  ): Promise<IResponseReturn<RoleDto>> {
    return this.permissionService.updateByAdmin(roleId, body);
  }

  @RoleAdminDeleteDoc()
  @Response('role.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
  @ActivityLog(EnumActivityLogAction.adminRoleDelete)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete/:roleId')
  async delete(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string
  ): Promise<IResponseReturn<void>> {
    return this.permissionService.deleteByAdmin(roleId);
  }
}
