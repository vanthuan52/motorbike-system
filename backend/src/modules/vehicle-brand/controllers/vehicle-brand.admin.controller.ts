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
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '../constants/vehicle-brand.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { EnumRoleType } from '@/modules/role/enums/role.enum';
import { Prisma } from '@/generated/prisma-client';

import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';

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
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleBrandSelect,
      Prisma.VehicleBrandWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VEHICLE_BRAND_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<VehicleBrandListResponseDto>> {
    const result = await this.vehicleBrandService.getListOffset(
      pagination,
      status
    );
    const mapped = this.vehicleBrandUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @VehicleAdminBrandParamsIdDoc()
  @Response('vehicle-brand.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
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
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected(EnumRoleType.admin)
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
    return { data: created };
  }

  @VehicleAdminBrandUpdateDoc()
  @Response('vehicle-brand.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
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
    await this.vehicleBrandService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @VehicleAdminBrandUpdateStatusDoc()
  @Response('vehicle-brand.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected(EnumRoleType.admin)
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
    await this.vehicleBrandService.updateStatus(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @VehicleAdminBrandDeleteDoc()
  @Response('vehicle-brand.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected(EnumRoleType.admin)
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
    await this.vehicleBrandService.delete(
      id,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {};
  }
}
