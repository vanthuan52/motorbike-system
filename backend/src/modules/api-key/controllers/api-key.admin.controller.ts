import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterEqualBoolean,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  ApiKeyDefaultAvailableSearch,
  ApiKeyDefaultType,
} from '@/modules/api-key/constants/api-key.list.constant';
import { ApiKeyCreateRequestDto } from '@/modules/api-key/dtos/request/api-key.create.request.dto';
import { ApiKeyUpdateDateRequestDto } from '@/modules/api-key/dtos/request/api-key.update-date.request.dto';
import { ApiKeyUpdateRequestDto } from '@/modules/api-key/dtos/request/api-key.update.request.dto';
import { ApiKeyCreateResponseDto } from '@/modules/api-key/dtos/response/api-key.create.response.dto';
import { ApiKeyService } from '@/modules/api-key/services/api-key.service';
import {
  ApiKeyAdminCreateDoc,
  ApiKeyAdminDeleteDoc,
  ApiKeyAdminListDoc,
  ApiKeyAdminResetDoc,
  ApiKeyAdminUpdateDateDoc,
  ApiKeyAdminUpdateDoc,
  ApiKeyAdminUpdateStatusDoc,
} from '@/modules/api-key/docs/api-key.admin.doc';
import {
  IPaginationEqual,
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
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
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { ApiKeyDto } from '@/modules/api-key/dtos/api-key.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { ApiKeyUpdateStatusRequestDto } from '@/modules/api-key/dtos/request/api-key.update-status.request.dto';
import { ApiKeyUtil } from '@/modules/api-key/utils/api-key.util';
import { HelperService } from '@/common/helper/services/helper.service';
import { EnumHelperDateDayOf } from '@/common/helper/enums/helper.enum';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { EnumApiKeyType } from '@/modules/api-key/enums/api-key.enum';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.apiKey')
@Controller({
  version: '1',
  path: '/api-key',
})
export class ApiKeyAdminController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly apiKeyUtil: ApiKeyUtil,
    private readonly helperService: HelperService
  ) {}

  @ApiKeyAdminListDoc()
  @ResponsePaging('apiKey.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ApiKeyDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApiKeySelect,
      Prisma.ApiKeyWhereInput
    >,
    @PaginationQueryFilterEqualBoolean('isActive')
    isActive?: Record<string, IPaginationEqual>,
    @PaginationQueryFilterInEnum<EnumApiKeyType>('type', ApiKeyDefaultType)
    type?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<ApiKeyDto>> {
    const result = await this.apiKeyService.getListOffset(pagination, {
      ...isActive,
      ...type,
    });
    const mapped = this.apiKeyUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @ApiKeyAdminCreateDoc()
  @Response('apiKey.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyCreate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Post('/create')
  async create(
    @Body() body: ApiKeyCreateRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    const transformed = {
      ...body,
      startAt:
        body.startAt && body.endAt
          ? this.helperService.dateCreate(body.startAt, {
              dayOf: EnumHelperDateDayOf.start,
            })
          : null,
      endAt:
        body.startAt && body.endAt
          ? this.helperService.dateCreate(body.endAt, {
              dayOf: EnumHelperDateDayOf.end,
            })
          : null,
    };

    const { created, secret } = await this.apiKeyService.createByAdmin(
      transformed,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapCreate(created, secret),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(created),
    };
  }

  @ApiKeyAdminResetDoc()
  @Response('apiKey.reset')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyReset)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/update/:apiKeyId/reset')
  async reset(
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    apiKeyId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyCreateResponseDto>> {
    const { updated, secret } = await this.apiKeyService.resetByAdmin(
      apiKeyId,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapCreate(updated, secret),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(updated),
    };
  }

  @ApiKeyAdminUpdateDoc()
  @Response('apiKey.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyUpdate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:apiKeyId')
  async update(
    @Body() body: ApiKeyUpdateRequestDto,
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    apiKeyId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const updated = await this.apiKeyService.updateByAdmin(
      apiKeyId,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapOne(updated),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(updated),
    };
  }

  @ApiKeyAdminUpdateDateDoc()
  @Response('apiKey.updateDate')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyUpdateDate)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Put('/update/:apiKeyId/date')
  async updateDate(
    @Body() body: ApiKeyUpdateDateRequestDto,
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    apiKeyId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const updated = await this.apiKeyService.updateDatesByAdmin(
      apiKeyId,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapOne(updated),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(updated),
    };
  }

  @ApiKeyAdminUpdateStatusDoc()
  @Response('apiKey.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyUpdateStatus)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Patch('/update/:apiKeyId/status')
  async updateStatus(
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    apiKeyId: string,
    @Body() body: ApiKeyUpdateStatusRequestDto,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const updated = await this.apiKeyService.updateStatusByAdmin(
      apiKeyId,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapOne(updated),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(updated),
    };
  }

  @ApiKeyAdminDeleteDoc()
  @Response('apiKey.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.apiKey,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @ActivityLog(EnumActivityLogAction.adminApiKeyDelete)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Delete('/delete/:apiKeyId')
  async delete(
    @Param('apiKeyId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    apiKeyId: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<ApiKeyDto>> {
    const deleted = await this.apiKeyService.deleteByAdmin(
      apiKeyId,
      { ipAddress, userAgent, geoLocation },
      userId
    );

    return {
      data: this.apiKeyUtil.mapOne(deleted),
      metadataActivityLog: this.apiKeyUtil.mapActivityLogMetadata(deleted),
    };
  }
}
