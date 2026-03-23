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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class VehicleModelAdminController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehicleModelUtil: VehicleModelUtil,
    private readonly paginationUtil: PaginationUtil,
  ) {}

  @VehicleModelAdminListDoc()
  @ResponsePaging('vehicle-model.list')
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
    modelYear?: number,
  ): Promise<IResponsePagingReturn<VehicleModelListResponseDto>> {
    const filters: Record<string, any> = {
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

    const { data, total } = await this.vehicleModelService.getListOffset(
      pagination,
      filters,
    );
    const mapped = this.vehicleModelUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @VehicleModelAdminGetDoc()
  @Response('vehicle-model.get')
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
  ): Promise<IResponseReturn<VehicleModelDto>> {
    const vehicleModel = await this.vehicleModelService.findOneById(id);
    const mapped = this.vehicleModelUtil.mapGet(vehicleModel);
    return { data: mapped };
  }

  @VehicleModelAdminCreateDoc()
  @Response('vehicle-model.create')
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
    @Body() body: VehicleModelCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.vehicleModelService.create(body);
    return { data: { _id: created.id } };
  }

  @VehicleModelAdminUpdateDoc()
  @Response('vehicle-model.update')
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
    @Body() body: VehicleModelUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleModelService.update(id, body);
    return {};
  }

  @VehicleModelAdminUpdateStatusDoc()
  @Response('vehicle-model.updateStatus')
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
    @Body() body: VehicleModelUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleModelService.updateStatus(id, body);
    return {};
  }

  @VehicleModelAdminDeleteDoc()
  @Response('vehicle-model.delete')
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
    await this.vehicleModelService.delete(id);
    return {};
  }
}
