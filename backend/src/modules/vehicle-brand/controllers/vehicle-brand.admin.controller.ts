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
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumRoleType,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import {
  VEHICLE_BRAND_DEFAULT_AVAILABLE_ORDER_BY,
  VEHICLE_BRAND_DEFAULT_AVAILABLE_SEARCH,
  VEHICLE_BRAND_DEFAULT_STATUS,
} from '../constants/vehicle-brand.list.constant';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';
import { VehicleBrandUtil } from '../utils/vehicle-brand.util';
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';

@ApiTags('modules.admin.vehicle-brand')
@Controller({
  version: '1',
  path: '/vehicle-brand',
})
export class VehicleBrandAdminController {
  constructor(
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleBrandUtil: VehicleBrandUtil,
    private readonly paginationUtil: PaginationUtil,
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
    pagination: IPaginationQueryOffsetParams,
    @PaginationQueryFilterInEnum('status', VEHICLE_BRAND_DEFAULT_STATUS)
    status: Record<string, IPaginationIn>,
  ): Promise<IResponsePagingReturn<VehicleBrandListResponseDto>> {
    const { data, total } = await this.vehicleBrandService.getListOffset(
      pagination,
      status,
    );
    const mapped = this.vehicleBrandUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
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
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<VehicleBrandDto>> {
    const vehicleBrand = await this.vehicleBrandService.findOneById(id);
    const mapped = this.vehicleBrandUtil.mapGet(vehicleBrand);
    return { data: mapped };
  }

  @VehicleAdminBrandCreateDoc()
  @Response('vehicle-brand.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: VehicleBrandCreateRequestDto,
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.vehicleBrandService.create(body);
    return { data: { _id: created._id } };
  }

  @VehicleAdminBrandUpdateDoc()
  @Response('vehicle-brand.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: VehicleBrandUpdateRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleBrandService.update(id, body);
    return {};
  }

  @VehicleAdminBrandUpdateStatusDoc()
  @Response('vehicle-brand.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
    @Body() body: VehicleBrandUpdateStatusRequestDto,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleBrandService.updateStatus(id, body);
    return {};
  }

  @VehicleAdminBrandDeleteDoc()
  @Response('vehicle-brand.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.user,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidUuidPipe) id: string,
  ): Promise<IResponseReturn<void>> {
    await this.vehicleBrandService.delete(id);
    return {};
  }
}
