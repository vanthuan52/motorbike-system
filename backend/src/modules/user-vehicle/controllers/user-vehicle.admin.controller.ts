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
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
} from '@/common/response/interfaces/response.interface';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { UserVehicleDto } from '../dtos/user-vehicle.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import {
  UserVehicleAdminCreateDoc,
  UserVehicleAdminDeleteDoc,
  UserVehicleAdminGetDoc,
  UserVehicleAdminListByUserDoc,
  UserVehicleAdminListDoc,
  UserVehicleAdminUpdateDoc,
} from '../docs/user-vehicle.admin.doc';
import { UserVehicleUtil } from '../utils/user-vehicle.util';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import {
  USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
  USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/user-vehicle.list.constant';
import { UserVehicleService } from '../services/user-vehicle.service';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

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

@ApiTags('modules.admin.user-vehicle')
@Controller({
  version: '1',
  path: '/user-vehicle',
})
export class UserVehicleAdminController {
  constructor(
    private readonly userVehicleService: UserVehicleService,
    private readonly userVehicleUtil: UserVehicleUtil
  ) {}

  @UserVehicleAdminListDoc()
  @ResponsePaging('user-vehicle.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >,
    @Query('vehicleModel')
    vehicleModelId: string
  ): Promise<IResponsePagingReturn<UserVehicleListResponseDto>> {
    const filters: Record<string, any> = {};

    if (vehicleModelId) {
      filters['vehicleModelId'] = vehicleModelId;
    }

    const result = await this.userVehicleService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.userVehicleUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @UserVehicleAdminListByUserDoc()
  @ResponsePaging('user-vehicle.listByUser')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/user/:userId')
  async getByUserId(
    @Param('userId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    userId: string,
    @PaginationOffsetQuery({
      availableSearch: USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.UserVehicleSelect,
      Prisma.UserVehicleWhereInput
    >
  ): Promise<IResponsePagingReturn<UserVehicleListResponseDto>> {
    const filters: Record<string, any> = {
      userId: userId,
    };
    const result = await this.userVehicleService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.userVehicleUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @UserVehicleAdminGetDoc()
  @Response('user-vehicle.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string
  ): Promise<IResponseReturn<UserVehicleDto>> {
    const userVehicle = await this.userVehicleService.findOneById(id);
    const mapped = this.userVehicleUtil.mapGet(userVehicle);
    return { data: mapped };
  }

  @UserVehicleAdminCreateDoc()
  @Response('user-vehicle.create')
  @ActivityLog(EnumActivityLogAction.adminUserVehicleCreate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: UserVehicleCreateRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.userVehicleService.create(body, {
      ipAddress,
      userAgent,
      geoLocation,
    });
    return {
      data: { id: created.id },
      metadataActivityLog: this.userVehicleUtil.mapActivityLogMetadata(created),
    };
  }

  @UserVehicleAdminUpdateDoc()
  @Response('user-vehicle.update')
  @ActivityLog(EnumActivityLogAction.adminUserVehicleUpdate)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string,
    @Body() body: UserVehicleUpdateRequestDto,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const updated = await this.userVehicleService.update(
      id,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      }
    );
    return {
      metadataActivityLog: this.userVehicleUtil.mapActivityLogMetadata(updated),
    };
  }

  @UserVehicleAdminDeleteDoc()
  @Response('user-vehicle.delete')
  @ActivityLog(EnumActivityLogAction.adminUserVehicleDelete)
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    const deleted = await this.userVehicleService.delete(id, {
      ipAddress,
      userAgent,
      geoLocation,
    });
    return {
      metadataActivityLog: this.userVehicleUtil.mapActivityLogMetadata(deleted),
    };
  }
}
