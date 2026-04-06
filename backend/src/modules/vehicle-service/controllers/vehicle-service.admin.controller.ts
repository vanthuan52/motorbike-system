import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  VehicleAdminServiceCreateDoc,
  VehicleAdminServiceDeleteDoc,
  VehicleAdminServiceGetDoc,
  VehicleAdminServiceListDoc,
  VehicleAdminServiceUpdateDoc,
  VehicleAdminServiceUpdateStatusDoc,
} from '../docs/vehicle-service.admin.doc';
import { VehicleServiceUtil } from '../utils/vehicle-service.util';
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
  VehicleServiceDefaultAvailableOrderBy,
  VehicleServiceDefaultAvailableSearch,
  VehicleServiceDefaultStatus,
} from '../constants/vehicle-service.list.constant';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
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
import { Prisma } from '@/generated/prisma-client';
import { IVehicleServiceListFilters } from '../interfaces/vehicle-service.filter.interface';

@ApiTags('modules.admin.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServiceAdminController {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleServiceUtil: VehicleServiceUtil
  ) {}

  @VehicleAdminServiceListDoc()
  @ResponsePaging('vehicle-service.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VehicleServiceDefaultAvailableSearch,
      availableOrderBy: VehicleServiceDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VehicleServiceDefaultStatus)
    status?: Record<string, IPaginationIn>,
    @Query('serviceCategory')
    serviceCategoryId?: string
  ): Promise<IResponsePagingReturn<VehicleServiceListResponseDto>> {
    const filters: IVehicleServiceListFilters = {
      ...status,
    };

    if (serviceCategoryId) {
      filters['serviceCategoryId'] = serviceCategoryId;
    }

    const result = await this.vehicleServiceService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.vehicleServiceUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @VehicleAdminServiceGetDoc()
  @Response('vehicle-service.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<VehicleServiceDto>> {
    const vehicleService = await this.vehicleServiceService.findOneById(id);
    const mapped = this.vehicleServiceUtil.mapOne(vehicleService);
    return { data: mapped };
  }

  @VehicleAdminServiceCreateDoc()
  @Response('vehicle-service.create')
  @ActivityLog(EnumActivityLogAction.adminVehicleServiceCreate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: VehicleServiceCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.vehicleServiceService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    return {
      data: { id: created.id },
      metadataActivityLog:
        this.vehicleServiceUtil.mapActivityLogMetadata(created),
    };
  }

  @VehicleAdminServiceUpdateDoc()
  @Response('vehicle-service.update')
  @ActivityLog(EnumActivityLogAction.adminVehicleServiceUpdate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleServiceUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleServiceService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {
      metadataActivityLog:
        this.vehicleServiceUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleAdminServiceUpdateStatusDoc()
  @Response('vehicle-service.updateStatus')
  @ActivityLog(EnumActivityLogAction.adminVehicleServiceUpdateStatus)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleServiceUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleServiceService.updateStatus(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {
      metadataActivityLog:
        this.vehicleServiceUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleAdminServiceDeleteDoc()
  @Response('vehicle-service.delete')
  @ActivityLog(EnumActivityLogAction.adminVehicleServiceDelete)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleService,
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
    const deleted = await this.vehicleServiceService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {
      metadataActivityLog:
        this.vehicleServiceUtil.mapActivityLogMetadata(deleted),
    };
  }
}
