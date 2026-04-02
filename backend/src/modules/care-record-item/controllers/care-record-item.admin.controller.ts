import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordItemService } from '../services/care-record-item.service';
import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordItemCreateDoc,
  CareRecordItemDeleteDoc,
  CareRecordItemAdminListDoc,
  CareRecordItemParamsIdDoc,
  CareRecordItemUpdateDoc,
  CareRecordItemUpdateApprovalDoc,
} from '../docs/care-record-item.admin.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/care-record-item.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordItemUtil } from '../utils/care-record-item.util';
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

@ApiTags('modules.admin.care-record-item')
@Controller({
  version: '1',
  path: '/care-record-item',
})
export class CareRecordItemAdminController {
  constructor(
    private readonly careRecordItemService: CareRecordItemService,
    private readonly careRecordItemUtil: CareRecordItemUtil
  ) {}

  @CareRecordItemAdminListDoc()
  @ResponsePaging('care-record-item.list')
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
      availableSearch: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_ITEM_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<IResponsePagingReturn<CareRecordItemListResponseDto>> {
    const filters: Record<string, any> = {};

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordItemService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordItemUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordItemParamsIdDoc()
  @Response('care-record-item.get')
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
  ): Promise<IResponseReturn<CareRecordItemGetFullResponseDto>> {
    const careRecordItem = await this.careRecordItemService.findOneById(id);
    const mapped = this.careRecordItemUtil.mapGetFull(careRecordItem);
    return { data: mapped };
  }

  @CareRecordItemCreateDoc()
  @Response('care-record-item.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordItemCreate)
  @Post('/create')
  async create(
    @Body() body: CareRecordItemCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordItemService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return { data: { id: created.id } };
  }

  @CareRecordItemUpdateDoc()
  @Response('care-record-item.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordItemUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordItemUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordItemUpdateApprovalDoc()
  @Response('care-record-item.updateApproval')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordItemApproval)
  @Patch('/update/:id/approval')
  async updateApproval(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordItemUpdateApprovalRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.updateApproval(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordItemDeleteDoc()
  @Response('care-record-item.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordItemDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordItemService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {};
  }
}
