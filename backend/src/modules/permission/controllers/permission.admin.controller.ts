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
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
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
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  PermissionDefaultAvailableSearch,
  PermissionDefaultGroup,
} from '@/modules/permission/constants/permission.list.constant';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import {
  PermissionAdminGetDoc,
  PermissionAdminListDoc,
  PermissionAdminUpdateDoc,
  PermissionAdminDeleteDoc,
} from '../docs/permission.admin.doc';
import { PermissionUtil } from '../utils/permission.util';
import { PermissionDto } from '../dtos/permission.dto';
import { PermissionService } from '../services/permission.service';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { EnumPermissionGroup } from '@/modules/permission/enums/permission.enum';
import { Prisma } from '@/generated/prisma-client';

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
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: PermissionDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.PermissionSelect,
      Prisma.PermissionWhereInput
    >,
    @PaginationQueryFilterInEnum<EnumPermissionGroup>(
      'group',
      PermissionDefaultGroup
    )
    group?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<PermissionListResponseDto>> {
    const result = await this.permissionService.getListOffsetByAdmin(
      pagination,
      { ...group }
    );
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
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/get/:permissionId')
  async get(
    @Param('permissionId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    permissionId: string
  ): Promise<IResponseReturn<PermissionDto>> {
    const permission = await this.permissionService.getOne(permissionId);
    const mapped = this.permissionUtil.mapOne(permission);
    return { data: mapped };
  }

  @PermissionAdminListDoc()
  @Response('permission.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminPermissionCreate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/create')
  async create(
    @Body()
    body: PermissionCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<PermissionDto>> {
    const created = await this.permissionService.createByAdmin(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    const mapped = this.permissionUtil.mapOne(created);
    return {
      data: mapped,
      metadataActivityLog: this.permissionUtil.mapActivityLogMetadata(created),
    };
  }

  @PermissionAdminUpdateDoc()
  @Response('permission.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminPermissionUpdate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:permissionId')
  async update(
    @Param('permissionId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    permissionId: string,
    @Body()
    body: PermissionUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<PermissionDto>> {
    const updated = await this.permissionService.updateByAdmin(
      permissionId,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    const mapped = this.permissionUtil.mapOne(updated);
    return {
      data: mapped,
      metadataActivityLog: this.permissionUtil.mapActivityLogMetadata(updated),
    };
  }

  @PermissionAdminDeleteDoc()
  @Response('permission.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.role,
    action: [EnumPolicyAction.read, EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminPermissionDelete)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete/:permissionId')
  async delete(
    @Param('permissionId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    permissionId: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const deleted = await this.permissionService.deleteByAdmin(
      permissionId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {
      metadataActivityLog: this.permissionUtil.mapActivityLogMetadata(deleted),
    };
  }
}
