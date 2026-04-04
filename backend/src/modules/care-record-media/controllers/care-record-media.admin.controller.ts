import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CareRecordMediaDefaultAvailableOrderBy,
  CareRecordMediaDefaultAvailableSearch,
} from '../constants/care-record-media.list.constant';
import {
  CareRecordMediaAdminCreateDoc,
  CareRecordMediaAdminDeleteDoc,
  CareRecordMediaAdminListDoc,
  CareRecordMediaAdminParamsIdDoc,
  CareRecordMediaAdminUpdateDoc,
} from '../docs/care-record-media.admin.doc';
import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaService } from '../services/care-record-media.service';
import { CareRecordMediaUtil } from '../utils/care-record-media.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { ICareRecordMediaListFilters } from '../interfaces/care-record-media.filter.interface';

@ApiTags('modules.admin.care-record-media')
@Controller({
  version: '1',
  path: '/care-record-media',
})
export class CareRecordMediaAdminController {
  constructor(
    private readonly careRecordMediaService: CareRecordMediaService,
    private readonly careRecordMediaUtil: CareRecordMediaUtil
  ) {}

  @CareRecordMediaAdminListDoc()
  @ResponsePaging('care-record-media.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: CareRecordMediaDefaultAvailableSearch,
      availableOrderBy: CareRecordMediaDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<IResponsePagingReturn<CareRecordMediaListResponseDto>> {
    const filters: ICareRecordMediaListFilters = {};

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordMediaService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordMediaUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordMediaAdminParamsIdDoc()
  @Response('care-record-media.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<CareRecordMediaGetFullResponseDto>> {
    const careRecordMedia = await this.careRecordMediaService.findOneById(id);
    return {
      data: this.careRecordMediaUtil.mapGetFull(careRecordMedia),
    };
  }

  @CareRecordMediaAdminCreateDoc()
  @Response('care-record-media.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordMediaCreate)
  @Post('/create')
  async create(
    @Body() body: CareRecordMediaCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordMediaService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return { data: { id: created.id } };
  }

  @CareRecordMediaAdminUpdateDoc()
  @Response('care-record-media.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordMediaUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordMediaUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordMediaService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordMediaAdminDeleteDoc()
  @Response('care-record-media.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordMediaDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordMediaService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {};
  }
}
