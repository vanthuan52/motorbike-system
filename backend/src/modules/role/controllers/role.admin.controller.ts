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
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { AuthJwtPayload } from '@/modules/auth/decorators/auth.jwt.decorator';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';

import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RoleDto } from '@/modules/role/dtos/role.dto';
import { RoleUtil } from '@/modules/role/utils/role.util';
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
import { RoleListResponseDto } from '@/modules/role/dtos/response/role.list.response.dto';
import { RolePermissionsResponseDto } from '@/modules/role/dtos/response/role.abilities.response.dto';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.role')
@Controller({
  version: '1',
  path: '/role',
})
export class RoleAdminController {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleUtil: RoleUtil
  ) {}

  @RoleAdminListDoc()
  @Response('role.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: RoleDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.RoleSelect,
      Prisma.RoleWhereInput
    >,
    @PaginationQueryFilterInEnum('type', RoleDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<RoleListResponseDto>> {
    const result = await this.roleService.getListOffsetByAdmin(pagination, {
      ...type,
    });
    const mapped = this.roleUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @RoleAdminGetDoc()
  @Response('role.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/get/:roleId')
  async get(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string
  ): Promise<IResponseReturn<RoleDto>> {
    const role = await this.roleService.getOne(roleId);
    const mapped = this.roleUtil.mapOne(role);
    return { data: mapped };
  }

  @RoleAdminGetDoc()
  @Response('role.getPermissions')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/get/:roleId/permissions')
  async getPermissions(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string
  ): Promise<IResponseReturn<RolePermissionsResponseDto>> {
    const permissions = await this.roleService.getPermissions(roleId);
    return { data: { permissions: permissions as any } };
  }

  @RoleAdminCreateDoc()
  @Response('role.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminRoleCreate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/create')
  async create(
    @Body()
    body: RoleCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<RoleDto>> {
    const created = await this.roleService.createByAdmin(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    const mapped = this.roleUtil.mapOne(created);
    return {
      data: mapped,
      metadataActivityLog: this.roleUtil.mapActivityLogMetadata(created),
    };
  }

  @RoleAdminUpdateDoc()
  @Response('role.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminRoleUpdate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:roleId')
  async update(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string,
    @Body()
    body: RoleUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<RoleDto>> {
    const updated = await this.roleService.updateByAdmin(
      roleId,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    const mapped = this.roleUtil.mapOne(updated);
    return {
      data: mapped,
      metadataActivityLog: this.roleUtil.mapActivityLogMetadata(updated),
    };
  }

  @RoleAdminDeleteDoc()
  @Response('role.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminRoleDelete)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete/:roleId')
  async delete(
    @Param('roleId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    roleId: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const deleted = await this.roleService.deleteByAdmin(
      roleId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {
      metadataActivityLog: this.roleUtil.mapActivityLogMetadata(deleted),
    };
  }
}
