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
import { CareRecordChecklistService } from '../services/care-record-checklist.service';
import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordChecklistCreateDoc,
  CareRecordChecklistDeleteDoc,
  CareRecordChecklistListDoc,
  CareRecordChecklistParamsIdDoc,
  CareRecordChecklistUpdateDoc,
  CareRecordChecklistUpdateStatusDoc,
  CareRecordChecklistUpdateResultDoc,
} from '../docs/care-record-checklist.doc';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  CareRecordChecklistDefaultAvailableOrderBy,
  CareRecordChecklistDefaultAvailableSearch,
  CareRecordChecklistDefaultResult,
  CareRecordChecklistDefaultStatus,
} from '../constants/care-record-checklist.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { CareRecordChecklistUtil } from '../utils/care-record-checklist.util';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { ICareRecordChecklistListFilters } from '../interfaces/care-record-checklist.filter.interface';

@ApiTags('modules.care-record-checklist')
@Controller({
  version: '1',
  path: '/care-record-checklist',
})
export class CareRecordChecklistController {
  constructor(
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly careRecordChecklistUtil: CareRecordChecklistUtil
  ) {}

  @CareRecordChecklistListDoc()
  @ResponsePaging('care-record-checklist.list')
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
      availableSearch: CareRecordChecklistDefaultAvailableSearch,
      availableOrderBy: CareRecordChecklistDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CareRecordChecklistDefaultStatus)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('result', CareRecordChecklistDefaultResult)
    result: Record<string, IPaginationIn>,
    @Query('careRecordService', RequestOptionalParseObjectIdPipe)
    careRecordServiceId: string
  ): Promise<IResponsePagingReturn<CareRecordChecklistListResponseDto>> {
    const filters: ICareRecordChecklistListFilters = {
      ...status,
      ...result,
    };

    if (careRecordServiceId) {
      filters['careRecordServiceId'] = careRecordServiceId;
    }

    const paginationResult =
      await this.careRecordChecklistService.getListOffset(pagination, filters);
    const mapped = this.careRecordChecklistUtil.mapList(paginationResult.data);
    return {
      ...paginationResult,
      data: mapped,
    };
  }

  @CareRecordChecklistParamsIdDoc()
  @Response('care-record-checklist.get')
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
  ): Promise<IResponseReturn<CareRecordChecklistGetFullResponseDto>> {
    const careRecordChecklist =
      await this.careRecordChecklistService.findOneById(id);
    const mapped = this.careRecordChecklistUtil.mapGetFull(careRecordChecklist);
    return { data: mapped };
  }

  @CareRecordChecklistCreateDoc()
  @Response('care-record-checklist.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordChecklistCreate)
  @Post('/create')
  async create(
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordChecklistCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordChecklistService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return { data: { id: created.id } };
  }

  @CareRecordChecklistUpdateDoc()
  @Response('care-record-checklist.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordChecklistUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordChecklistUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.careRecordChecklistService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return;
  }

  @CareRecordChecklistUpdateStatusDoc()
  @Response('care-record-checklist.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordChecklistUpdateStatus)
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordChecklistUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.careRecordChecklistService.updateStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return;
  }

  @CareRecordChecklistUpdateResultDoc()
  @Response('care-record-checklist.updateResult')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordChecklistUpdateResult)
  @Patch('/update/:id/result')
  async updateResult(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareRecordChecklistUpdateResultRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.careRecordChecklistService.updateResult(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return;
  }

  @CareRecordChecklistDeleteDoc()
  @Response('care-record-checklist.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordChecklistDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordChecklistService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return;
  }
}
