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
import { ServiceChecklistService } from '../services/service-checklist.service';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDto } from '../dtos/service-checklist.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  ServiceChecklistAdminCreateDoc,
  ServiceChecklistAdminDeleteDoc,
  ServiceChecklistAdminListDoc,
  ServiceChecklistAdminParamsIdDoc,
  ServiceChecklistAdminUpdateDoc,
} from '../docs/service-checklist.admin.doc';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
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
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import {
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
  SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/service-checklist.list.constant';
import { EnumVehicleModelType } from '@/modules/vehicle-model/enums/vehicle-model.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ServiceChecklistUtil } from '../utils/service-checklist.util';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { Prisma } from '@/generated/prisma-client';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';

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
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: SERVICE_CHECKLIST_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    @Query('careArea', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    careAreaId: string,
    @Query('vehicleType') vehicleType: EnumVehicleModelType
  ): Promise<IResponsePagingReturn<ServiceChecklistListResponseDto>> {
    const filters: Prisma.ServiceChecklistWhereInput = {};

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

  @ServiceChecklistAdminParamsIdDoc()
  @Response('service-checklist.get')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<ServiceChecklistDto>> {
    const serviceChecklist = await this.serviceChecklistService.findOneById(id);
    return {
      data: this.serviceChecklistUtil.mapGet(serviceChecklist),
    };
  }

  @ServiceChecklistAdminCreateDoc()
  @Response('service-checklist.create')
  @RoleProtected(EnumRoleType.admin)
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
  ): Promise<IResponseReturn<{ id: string }>> {
    return this.serviceChecklistService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
  }

  @ServiceChecklistAdminUpdateDoc()
  @Response('service-checklist.update')
  @RoleProtected(EnumRoleType.admin)
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
    return this.serviceChecklistService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
  }

  @ServiceChecklistAdminDeleteDoc()
  @Response('service-checklist.delete')
  @RoleProtected(EnumRoleType.admin)
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
    return this.serviceChecklistService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
  }
}
