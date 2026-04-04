import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordConditionService } from '../services/care-record-condition.service';
import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';
import {
  CareRecordConditionAdminParamsIdDoc,
  CareRecordConditionAdminCreateDoc,
  CareRecordConditionAdminUpdateDoc,
  CareRecordConditionAdminDeleteDoc,
} from '../docs/care-record-condition.admin.doc';
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
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import { CareRecordConditionUtil } from '../utils/care-record-condition.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
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
import { ICareRecordConditionListFilters } from '../interfaces/care-record-condition.filter.interface';

@ApiTags('modules.admin.care-record-condition')
@Controller({
  version: '1',
  path: '/care-record-condition',
})
export class CareRecordConditionAdminController {
  constructor(
    private readonly careRecordConditionService: CareRecordConditionService,
    private readonly careRecordConditionUtil: CareRecordConditionUtil
  ) {}

  @ResponsePaging('care-record-condition.list')
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
      availableSearch: [],
      availableOrderBy: ['createdAt', 'updatedAt'],
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<IResponsePagingReturn<CareRecordConditionDto>> {
    const filters: ICareRecordConditionListFilters = {};

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordConditionService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordConditionUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordConditionAdminParamsIdDoc()
  @Response('care-record-condition.get')
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
  ): Promise<IResponseReturn<CareRecordConditionDto>> {
    const careRecordCondition =
      await this.careRecordConditionService.findOneById(id);
    return {
      data: this.careRecordConditionUtil.mapGet(careRecordCondition),
    };
  }

  @CareRecordConditionAdminCreateDoc()
  @Response('care-record-condition.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordConditionCreate)
  @Post('/create')
  async create(
    @Body() body: CareRecordConditionCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordConditionService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return { data: { id: created.id } };
  }

  @CareRecordConditionAdminUpdateDoc()
  @Response('care-record-condition.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordConditionUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordConditionUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordConditionService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordConditionAdminDeleteDoc()
  @Response('care-record-condition.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareRecordConditionDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordConditionService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {};
  }
}
