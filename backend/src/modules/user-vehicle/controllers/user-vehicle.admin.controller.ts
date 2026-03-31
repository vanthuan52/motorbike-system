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
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.userVehicle,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @Body() body: UserVehicleCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.userVehicleService.create(body);
    return { data: created };
  }

  @UserVehicleAdminUpdateDoc()
  @Response('user-vehicle.update')
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
    @Body() body: UserVehicleUpdateRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.userVehicleService.update(id, body);
    return {};
  }

  @UserVehicleAdminDeleteDoc()
  @Response('user-vehicle.delete')
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
    id: string
  ): Promise<IResponseReturn<void>> {
    await this.userVehicleService.delete(id);
    return {};
  }
}
