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
import { CareAreaService } from '../services/care-area.service';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaDto } from '../dtos/care-area.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  CareAreaAdminCreateDoc,
  CareAreaAdminDeleteDoc,
  CareAreaAdminForceDeleteDoc,
  CareAreaAdminListDoc,
  CareAreaAdminParamsIdDoc,
  CareAreaAdminRestoreDoc,
  CareAreaAdminTrashListDoc,
  CareAreaAdminUpdateDoc,
  CareAreaWithServiceChecklistDoc,
} from '../docs/care-area.admin.doc';
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
  CareAreaDefaultAvailableOrderBy,
  CareAreaDefaultAvailableSearch,
} from '../constants/care-area.list.constant';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareAreaUtil } from '../utils/care-area.util';
import { ServiceChecklistUtil } from '@/modules/service-checklist/utils/service-checklist.util';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';

@ApiTags('modules.admin.care-area')
@Controller({
  version: '1',
  path: '/care-area',
})
export class CareAreaAdminController {
  constructor(
    private readonly careAreaService: CareAreaService,
    private readonly careAreaUtil: CareAreaUtil,
    private readonly serviceChecklistUtil: ServiceChecklistUtil
  ) {}

  @CareAreaAdminListDoc()
  @ResponsePaging('care-area.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: CareAreaDefaultAvailableSearch,
      availableOrderBy: CareAreaDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams
  ): Promise<IResponsePagingReturn<CareAreaListResponseDto>> {
    const result = await this.careAreaService.getListOffset(pagination);
    const mapped = this.careAreaUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareAreaAdminParamsIdDoc()
  @Response('care-area.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe) id: string
  ): Promise<IResponseReturn<CareAreaDto>> {
    const careArea = await this.careAreaService.findOneById(id);
    const mapped = this.careAreaUtil.mapGet(careArea);
    return { data: mapped };
  }

  @CareAreaAdminCreateDoc()
  @Response('care-area.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareAreaCreate)
  @Post('/create')
  async create(
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareAreaCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.careAreaService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      data: { id: created.id },
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(created),
    };
  }

  @CareAreaWithServiceChecklistDoc()
  @ResponsePaging('care-area.listWithServiceChecklists')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list/checklists')
  async listWithServiceChecklists(
    @PaginationOffsetQuery({
      availableSearch: CareAreaDefaultAvailableSearch,
      availableOrderBy: CareAreaDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams,
    @Query('vehicleType') vehicleType?: EnumVehicleModelType
  ): Promise<IResponsePagingReturn<CareAreaWithServiceChecklistResponseDto>> {
    const { checklistMap, ...result } =
      await this.careAreaService.getListOffsetWithServiceChecklists(
        pagination,
        vehicleType
      );

    const mapped = result.data.map(careArea => {
      const checklists = checklistMap.get(careArea.id) || [];
      const mappedChecklists = this.serviceChecklistUtil.mapList(checklists);
      return this.careAreaUtil.mapWithServiceChecklists(
        careArea,
        mappedChecklists
      );
    });

    return {
      ...result,
      data: mapped,
    };
  }

  @CareAreaAdminUpdateDoc()
  @Response('care-area.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareAreaUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null,
    @Body() body: CareAreaUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    const data = await this.careAreaService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(data),
    };
  }

  @CareAreaAdminDeleteDoc()
  @Response('care-area.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareAreaDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') userId: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careAreaService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      userId
    );
    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(data),
    };
  }

  // === Trash/Restore ===

  @CareAreaAdminTrashListDoc()
  @ResponsePaging('care-area.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: CareAreaDefaultAvailableSearch,
      availableOrderBy: CareAreaDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams
  ): Promise<IResponsePagingReturn<CareAreaListResponseDto>> {
    const result = await this.careAreaService.getTrashList(pagination);
    const mapped = this.careAreaUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @CareAreaAdminRestoreDoc()
  @Response('care-area.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareAreaRestore)
  @Post('/restore/:id')
  async restore(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careAreaService.restore(
      id,
      { ipAddress, userAgent, geoLocation },
      restoredBy
    );
    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(data),
    };
  }

  @CareAreaAdminForceDeleteDoc()
  @Response('care-area.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.careArea,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminCareAreaForceDelete)
  @Delete('/force-delete/:id')
  async forceDelete(
    @Param('id', RequestRequiredPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.careAreaService.forceDelete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog: this.careAreaUtil.mapActivityLogMetadata(data),
    };
  }
}
