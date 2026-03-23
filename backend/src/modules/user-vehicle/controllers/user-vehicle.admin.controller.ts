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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import {
  USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
  USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/user-vehicle.list.constant';
import { UserVehicleService } from '../services/user-vehicle.service';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.user-vehicle')
@Controller({
  version: '1',
  path: '/user-vehicle',
})
export class UserVehicleAdminController {
  constructor(
    private readonly userVehicleService: UserVehicleService,
    private readonly userVehicleUtil: UserVehicleUtil,
    private readonly paginationUtil: PaginationUtil
  ) {}

  @UserVehicleAdminListDoc()
  @ResponsePaging('user-vehicle.list')
  @RoleProtected(EnumRoleType.admin)
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

    const { data, total } = await this.userVehicleService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.userVehicleUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @UserVehicleAdminListByUserDoc()
  @Get('/get/user/:userId')
  @ResponsePaging('user-vehicle.list')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
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
    const { data, total } = await this.userVehicleService.getListOffset(
      pagination,
      filters
    );
    const mapped = this.userVehicleUtil.mapList(data);
    return this.paginationUtil.formatOffset(mapped, total, pagination);
  }

  @UserVehicleAdminGetDoc()
  @Response('user-vehicle.get')
  @RoleProtected(EnumRoleType.admin)
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
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: UserVehicleCreateRequestDto
  ): Promise<IResponseReturn<{ id: string }>> {
    const created = await this.userVehicleService.create(body);
    return { data: { id: created.id } };
  }

  @UserVehicleAdminUpdateDoc()
  @Response('user-vehicle.update')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: UserVehicleUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.userVehicleService.update(id, body);
    return {};
  }

  @UserVehicleAdminDeleteDoc()
  @Response('user-vehicle.delete')
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    id: string
  ): Promise<IResponseReturn<boolean>> {
    await this.userVehicleService.delete(id);
    return { data: true };
  }
}
