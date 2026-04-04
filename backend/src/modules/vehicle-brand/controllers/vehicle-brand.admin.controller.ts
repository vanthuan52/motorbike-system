import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VehicleBrandService } from '../services/vehicle-brand.service';
import { VehicleBrandCreateRequestDto } from '../dtos/request/vehicle-brand.create.request.dto';
import { VehicleBrandUpdateRequestDto } from '../dtos/request/vehicle-brand.update.request.dto';
import { VehicleBrandUpdateStatusRequestDto } from '../dtos/request/vehicle-brand.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { VehicleBrandListResponseDto } from '../dtos/response/vehicle-brand.list.response.dto';
import { VehicleBrandDto } from '../dtos/vehicle-brand.dto';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationQueryOffsetParams,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  VehicleAdminBrandCreateDoc,
  VehicleAdminBrandDeleteDoc,
  VehicleAdminBrandListDoc,
  VehicleAdminBrandParamsIdDoc,
  VehicleAdminBrandUpdateDoc,
  VehicleAdminBrandUpdateStatusDoc,
} from '../docs/vehicle-brand.admin.doc';
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
  VehicleBrandDefaultAvailableOrderBy,
  VehicleBrandDefaultAvailableSearch,
  VehicleBrandDefaultStatus,
} from '../constants/vehicle-brand.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
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

@ApiTags('modules.admin.vehicle-brand')
@Controller({
  version: '1',
  path: '/vehicle-brand',
})
export class VehicleBrandAdminController {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleBrandUtil: VehicleBrandUtil
  ) {}

  @VehicleAdminBrandListDoc()
  @ResponsePaging('vehicle-brand.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VehicleBrandDefaultAvailableSearch,
      availableOrderBy: VehicleBrandDefaultAvailableOrderBy,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VehicleBrandDefaultStatus)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<VehicleBrandListResponseDto>> {
    const result = await this.vehicleBrandService.getListOffset(pagination, {
      ...status,
    });
    const mapped = this.vehicleBrandUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @VehicleAdminBrandParamsIdDoc()
  @Response('vehicle-brand.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string
  ): Promise<IResponseReturn<VehicleBrandDto>> {
    const vehicleBrand = await this.vehicleBrandService.findOneById(id);
    const mapped = this.vehicleBrandUtil.mapOne(vehicleBrand);
    return { data: mapped };
  }

  @VehicleAdminBrandCreateDoc()
  @Response('vehicle-brand.create')
  @ActivityLog(EnumActivityLogAction.adminVehicleBrandCreate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: VehicleBrandCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.vehicleBrandService.create(
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
        this.vehicleBrandUtil.mapActivityLogMetadata(created),
    };
  }

  @VehicleAdminBrandUpdateDoc()
  @Response('vehicle-brand.update')
  @ActivityLog(EnumActivityLogAction.adminVehicleBrandUpdate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleBrandUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleBrandService.update(
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
        this.vehicleBrandUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleAdminBrandUpdateStatusDoc()
  @Response('vehicle-brand.updateStatus')
  @ActivityLog(EnumActivityLogAction.adminVehicleBrandUpdateStatus)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @Body() body: VehicleBrandUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.vehicleBrandService.updateStatus(
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
        this.vehicleBrandUtil.mapActivityLogMetadata(updated),
    };
  }

  @VehicleAdminBrandDeleteDoc()
  @Response('vehicle-brand.delete')
  @ActivityLog(EnumActivityLogAction.adminVehicleBrandDelete)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.vehicleBrand,
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
    const deleted = await this.vehicleBrandService.delete(
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
        this.vehicleBrandUtil.mapActivityLogMetadata(deleted),
    };
  }
}
