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
import { CareRecordServiceService } from '../services/care-record-service.service';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  CareRecordServiceAdminCreateDoc,
  CareRecordServiceAdminDeleteDoc,
  CareRecordServiceAdminListDoc,
  CareRecordServiceAdminListWithChecklistsDoc,
  CareRecordServiceAdminParamsIdDoc,
  CareRecordServiceAdminUpdateDoc,
  CareRecordServiceAdminUpdateStatusDoc,
} from '../docs/care-record-service.admin.doc';
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
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_SERVICE_DEFAULT_STATUS,
} from '../constants/care-record-service.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { CareRecordServiceUtil } from '../utils/care-record-service.util';
import { RequestOptionalParseObjectIdPipe } from '@/common/request/pipes/request.optional-parse-object-id.pipe';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';

@ApiTags('modules.admin.care-record-service')
@Controller({
  version: '1',
  path: '/care-record-service',
})
export class CareRecordServiceAdminController {
  constructor(
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly careRecordServiceUtil: CareRecordServiceUtil
  ) {}

  @CareRecordServiceAdminListDoc()
  @ResponsePaging('care-record-service.list')
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
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_SERVICE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<IResponsePagingReturn<CareRecordServiceListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result = await this.careRecordServiceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.careRecordServiceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordServiceAdminListWithChecklistsDoc()
  @ResponsePaging('care-record-service.listWithChecklists')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithChecklists(
    @PaginationOffsetQuery({
      availableSearch: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', CARE_RECORD_SERVICE_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @Query('careRecord', RequestOptionalParseObjectIdPipe)
    careRecordId: string
  ): Promise<
    IResponsePagingReturn<CareRecordServiceWithChecklistsResponseDto>
  > {
    const filters: Record<string, any> = {
      ...status,
    };

    if (careRecordId) {
      filters['careRecordId'] = careRecordId;
    }

    const result =
      await this.careRecordServiceService.getListOffsetWithChecklists(
        pagination,
        filters
      );

    const mapped = result.data.map(item =>
      this.careRecordServiceUtil.mapWithChecklists(
        item.service,
        item.checklists
      )
    );

    return {
      ...result,
      data: mapped,
    };
  }

  @CareRecordServiceAdminParamsIdDoc()
  @Response('care-record-service.get')
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
  ): Promise<IResponseReturn<CareRecordServiceGetFullResponseDto>> {
    const careRecordService =
      await this.careRecordServiceService.findOneById(id);
    const mapped = this.careRecordServiceUtil.mapGetFull(careRecordService);
    return {
      data: mapped,
    };
  }

  @CareRecordServiceAdminCreateDoc()
  @Response('care-record-service.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: CareRecordServiceCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careRecordServiceService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return { data: { id: created.id } };
  }

  @CareRecordServiceAdminUpdateDoc()
  @Response('care-record-service.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordServiceUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordServiceAdminUpdateStatusDoc()
  @Response('care-record-service.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: CareRecordServiceUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.updateStatus(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {};
  }

  @CareRecordServiceAdminDeleteDoc()
  @Response('care-record-service.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careRecord,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.careRecordServiceService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {};
  }
}
