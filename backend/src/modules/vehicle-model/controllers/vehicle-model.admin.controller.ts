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
import { VehicleModelCreateRequestDto } from '../dtos/request/vehicle-model.create.request.dto';
import { VehicleModelUpdateRequestDto } from '../dtos/request/vehicle-model.update.request.dto';
import { VehicleModelUpdateStatusRequestDto } from '../dtos/request/vehicle-model.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { VehicleModelListResponseDto } from '../dtos/response/vehicle-model.list.response.dto';
import { VehicleModelDto } from '../dtos/vehicle-model.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  VehicleModelAdminCreateDoc,
  VehicleModelAdminDeleteDoc,
  VehicleModelAdminGetDoc,
  VehicleModelAdminListDoc,
  VehicleModelAdminUpdateDoc,
  VehicleModelAdminUpdateStatusDoc,
} from '../docs/vehicle-model.admin.doc';
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
  VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_MODEL_DEFAULT_FUEL_TYPE,
  VEHICLE_MODEL_DEFAULT_STATUS,
  VEHICLE_MODEL_DEFAULT_TYPE,
} from '../constants/vehicle-model.list.constant';
import { VehicleModelService } from '../services/vehicle-model.service';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { VehicleModelUtil } from '../utils/vehicle-model.util';
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
import { Prisma } from '@/generated/prisma-client';
import { IVehicleModelListFilters } from '../interfaces/vehicle-model.filter.interface';

@ApiTags('modules.admin.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelAdminController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehicleModelUtil: VehicleModelUtil
  ) {}

  @VehicleModelAdminListDoc()
  @ResponsePaging('vehicle-model.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_MODEL_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_MODEL_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleModelSelect,
      Prisma.VehicleModelWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VEHICLE_MODEL_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('type', VEHICLE_MODEL_DEFAULT_TYPE)
    type: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('fuelType', VEHICLE_MODEL_DEFAULT_FUEL_TYPE)
    fuelType: Record<string, IPaginationIn>,
    @Query('vehicleBrand')
    vehicleBrandId?: string,
    @Query('engineDisplacement')
    engineDisplacement?: number,
    @Query('modelYear')
    modelYear?: number
  ): Promise<IResponsePagingReturn<VehicleModelListResponseDto>> {
    const filters: IVehicleModelListFilters = {
      ...status,
      ...type,
      ...fuelType,
    };

    if (modelYear !== undefined) {
      filters['modelYear'] = modelYear;
    }
    if (engineDisplacement !== undefined) {
      filters['engineDisplacement'] = engineDisplacement;
    }
    if (vehicleBrandId) {
      filters['vehicleBrandId'] = vehicleBrandId;
    }

    const result = await this.vehicleModelService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.vehicleModelUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @VehicleModelAdminGetDoc()
  @Response('vehicle-model.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<VehicleModelDto>> {
    const vehicleModel = await this.vehicleModelService.findOneById(id);
    const mapped = this.vehicleModelUtil.mapOne(vehicleModel);
    return { data: mapped };
  }

  @VehicleModelAdminCreateDoc()
  @Response('vehicle-model.create')
  @ActivityLog(EnumActivityLogAction.adminVehicleModelCreate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: VehicleModelCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.vehicleModelService.create(
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
        this.vehicleModelUtil.mapActivityLogMetadata(created),
    };
  }

  @VehicleModelAdminUpdateDoc()
  @Response('vehicle-model.update')
  @ActivityLog(EnumActivityLogAction.adminVehicleModelUpdate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleModelUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleModelService.update(
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
        this.vehicleModelUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleModelAdminUpdateStatusDoc()
  @Response('vehicle-model.updateStatus')
  @ActivityLog(EnumActivityLogAction.adminVehicleModelUpdateStatus)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleModelUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleModelService.updateStatus(
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
        this.vehicleModelUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleModelAdminDeleteDoc()
  @Response('vehicle-model.delete')
  @ActivityLog(EnumActivityLogAction.adminVehicleModelDelete)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleModel,
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
    const deleted = await this.vehicleModelService.delete(
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
        this.vehicleModelUtil.mapActivityLogMetadata(deleted),
    };
  }
}
