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
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
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
  ServiceChecklistAdminCreateDoc,
  ServiceChecklistAdminDeleteDoc,
  ServiceChecklistAdminForceDeleteDoc,
  ServiceChecklistAdminGetDoc,
  ServiceChecklistAdminListDoc,
  ServiceChecklistAdminRestoreDoc,
  ServiceChecklistAdminTrashListDoc,
  ServiceChecklistAdminUpdateDoc,
} from '../docs/service-checklist.admin.doc';
import { ServiceChecklistService } from '../services/service-checklist.service';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistUtil } from '../utils/service-checklist.util';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { IServiceChecklistListFilters } from '../interfaces/service-checklist.filter.interface';
import {
  ServiceChecklistDefaultAvailableOrderBy,
  ServiceChecklistDefaultAvailableSearch,
} from '../constants/service-checklist.list.constant';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.service-checklist')
@Controller({
  version: '1',
  path: '/service-checklist',
})
export class ServiceChecklistAdminController {
  constructor(
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly serviceChecklistUtil: ServiceChecklistUtil
  ) {}

  @ServiceChecklistAdminListDoc()
  @ResponsePaging('service-checklist.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ServiceChecklistDefaultAvailableSearch,
      availableOrderBy: ServiceChecklistDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    @Query('careArea', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    careAreaId: string,
    @Query('vehicleType') vehicleType: EnumVehicleModelType
  ): Promise<IResponsePagingReturn<ServiceChecklistListResponseDto>> {
    const filters: IServiceChecklistListFilters = {};

    if (careAreaId) {
      filters.careAreaId = careAreaId;
    }
    if (vehicleType) {
      filters.vehicleType = { has: vehicleType };
    }

    const result = await this.serviceChecklistService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.serviceChecklistUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @ServiceChecklistAdminGetDoc()
  @Response('service-checklist.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<ServiceChecklistDto>> {
    const serviceChecklist =
      await this.serviceChecklistService.findOneById(id);
    return {
      data: this.serviceChecklistUtil.mapGet(serviceChecklist),
    };
  }

  @ServiceChecklistAdminCreateDoc()
  @Response('service-checklist.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServiceChecklistCreate)
  @Post('/create')
  async create(
    @Body() body: ServiceChecklistCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.serviceChecklistService.create(
      body,
      { ipAddress, userAgent, geoLocation },
      createdBy
    );
    return {
      data: { id: created.id },
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(created),
    };
  }

  @ServiceChecklistAdminUpdateDoc()
  @Response('service-checklist.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServiceChecklistUpdate)
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: ServiceChecklistUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.serviceChecklistService.update(
      id,
      body,
      { ipAddress, userAgent, geoLocation },
      updatedBy
    );
    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(updated),
    };
  }

  @ServiceChecklistAdminDeleteDoc()
  @Response('service-checklist.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServiceChecklistDelete)
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const deleted = await this.serviceChecklistService.delete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(deleted),
    };
  }

  // === Trash/Restore ===

  @ServiceChecklistAdminTrashListDoc()
  @ResponsePaging('service-checklist.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: ServiceChecklistDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >
  ): Promise<IResponsePagingReturn<ServiceChecklistListResponseDto>> {
    const result = await this.serviceChecklistService.getTrashList(pagination);
    const mapped = this.serviceChecklistUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @ServiceChecklistAdminRestoreDoc()
  @Response('service-checklist.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServiceChecklistRestore)
  @Post('/restore/:id')
  async restore(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.serviceChecklistService.restore(
      id,
      { ipAddress, userAgent, geoLocation },
      restoredBy
    );
    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(data),
    };
  }

  @ServiceChecklistAdminForceDeleteDoc()
  @Response('service-checklist.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.serviceChecklist,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminServiceChecklistForceDelete)
  @Delete('/force-delete/:id')
  async forceDelete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const data = await this.serviceChecklistService.forceDelete(
      id,
      { ipAddress, userAgent, geoLocation },
      deletedBy
    );
    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(data),
    };
  }
}
