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
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponseReturn,
  IResponsePagingReturn,
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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_SERVICE_DEFAULT_STATUS,
} from '../constants/vehicle-service.list.constant';
import { VehicleServiceService } from '../services/vehicle-service.service';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.vehicle-service')
@Controller({
  version: '1',
  path: '/vehicle-service',
})
export class VehicleServiceAdminController {
  constructor(
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly vehicleServiceUtil: VehicleServiceUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @VehicleAdminServiceListDoc()
  @ResponsePaging('vehicle-service.list')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: VEHICLE_SERVICE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: VEHICLE_SERVICE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.VehicleServiceSelect,
      Prisma.VehicleServiceWhereInput
    >,
    @PaginationQueryFilterInEnum('status', VEHICLE_SERVICE_DEFAULT_STATUS)
    status?: Record<string, IPaginationIn>,
    @Query('serviceCategory')
    serviceCategoryId?: string,
  ): Promise<IResponsePagingReturn<VehicleServiceListResponseDto>> {
    const filters: Record<string, any> = {
      ...status,
    };

    if (serviceCategoryId) {
      filters['serviceCategoryId'] = serviceCategoryId; // Prisma field
    }

    const { data, total } = await this.vehicleServiceService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.vehicleServiceUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @VehicleAdminServiceGetDoc()
  @Response('vehicle-service.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
  ): Promise<IResponseReturn<VehicleServiceDto>> {
    const vehicleService = await this.vehicleServiceService.findOneById(id);
    const mapped = this.vehicleServiceUtil.mapGet(vehicleService);
    return { data: mapped };
  }

  @VehicleAdminServiceCreateDoc()
  @Response('vehicle-service.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body('checklistItems')
    checklistItems: string[],
    @Body() body: VehicleServiceCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    body.checklistItems = checklistItems || [];
    const created = await this.vehicleServiceService.create(body);
    return { data: { _id: created.id } };
  }

  @VehicleAdminServiceUpdateDoc()
  @Response('vehicle-service.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body('checklistItems')
    checklistItems: string[],
    @Body() body: VehicleServiceUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    if (checklistItems !== undefined) {
        body.checklistItems = checklistItems;
    }
    await this.vehicleServiceService.update(id, body);
    return {};
  }

  @VehicleAdminServiceUpdateStatusDoc()
  @Response('vehicle-service.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: VehicleServiceUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleServiceService.updateStatus(id, body);
    return {};
  }

  @VehicleAdminServiceDeleteDoc()
  @Response('vehicle-service.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe) id: string,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleServiceService.delete(id);
    return {};
  }
}
