import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserVehicleService } from '../services/user-vehicle.service';
import {
  UserVehicleSharedListDoc,
  UserVehicleSharedGetDoc,
  UserVehicleSharedCreateDoc,
  UserVehicleSharedListByUserDoc,
  UserVehicleSharedUpdateDoc,
} from '../docs/user-vehicle.shared.doc';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
  USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/user-vehicle.list.constant';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import { UserVehicleGetFullResponseDto } from '../dtos/response/user-vehicle.full.response.dto';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '../enums/user-vehicle.status-code.enum';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserService } from '@/modules/user/services/user.service';
import {
  UserVehicleAdminCreateDoc,
  UserVehicleAdminGetDoc,
} from '../docs/user-vehicle.admin.doc';
import { UserVehicleParsePipe } from '../pipes/user-vehicle.parse.pipe';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';
import {
  IUserVehicleDoc,
  IUserVehicleEntity,
} from '../interfaces/user-vehicle.interface';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';

@ApiTags('module.shared.user-vehicle')
@Controller({
  version: '1',
  path: '/user-vehicle',
})
export class UserVehicleSharedController {
  constructor(
    private readonly userVehicleService: UserVehicleService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
  ) {}

  @UserVehicleSharedListDoc()
  @ResponsePaging('user-vehicle.list')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('vehicleModel', OptionalParseUUIDPipe)
    vehicleModelId: string,
  ): Promise<IResponsePaging<UserVehicleListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
    };

    if (vehicleModelId) {
      find['vehicleModel._id'] = vehicleModelId;
    }

    const UserVehicles = await this.userVehicleService.findAllWithVehicleModel(
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );

    const total: number =
      await this.userVehicleService.getTotalWithVehicleModel(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.userVehicleService.mapList(UserVehicles);
    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @UserVehicleSharedListByUserDoc()
  @Get('/get/user/:userId')
  @ResponsePaging('user-vehicle.list')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
    ENUM_POLICY_ROLE_TYPE.USER,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  async getByUserId(
    @Param('userId', RequestRequiredPipe) userId: string,
    @PaginationQuery({
      availableSearch: USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): Promise<IResponsePaging<UserVehicleListResponseDto>> {
    const userExists = await this.userService.findOneById(userId);
    if (!userExists) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    const find: Record<string, any> = {
      ..._search,
      user: userId,
    };

    const userVehicles: IUserVehicleEntity[] =
      await this.userVehicleService.findAllWithVehicleModel(find, {
        paging: { limit: _limit, offset: _offset },
        order: _order,
      });

    const total: number =
      await this.userVehicleService.getTotalWithVehicleModel(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.userVehicleService.mapList(userVehicles);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @UserVehicleSharedGetDoc()
  @Response('user-vehicle.get')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
    ENUM_POLICY_ROLE_TYPE.USER,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, UserVehicleParsePipe)
    userVehicle: UserVehicleDoc,
  ): Promise<IResponse<UserVehicleGetResponseDto>> {
    const UserVehicleWithBrand: IUserVehicleDoc =
      await this.userVehicleService.join(userVehicle);
    const mapped: UserVehicleGetResponseDto =
      this.userVehicleService.mapGet(UserVehicleWithBrand);
    return { data: mapped };
  }

  @UserVehicleSharedCreateDoc()
  @Response('user-vehicle.create')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
    ENUM_POLICY_ROLE_TYPE.USER,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: UserVehicleCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.vehicleModelService.findOneById(body.vehicleModel),
      this.userService.findOneById(body.user),
    ];

    const [checkVehicleModel, checkUser] = await Promise.all(promises);

    if (!checkVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }
    if (!checkUser) {
      throw new ConflictException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    try {
      const created = await this.userVehicleService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);
      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @UserVehicleSharedUpdateDoc()
  @Response('user-vehicle.update')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, UserVehicleParsePipe)
    userVehicle: UserVehicleDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: UserVehicleUpdateRequestDto,
  ): Promise<void> {
    if (body.vehicleModel) {
      const checkVehicleModel = await this.vehicleModelService.findOneById(
        body.vehicleModel,
      );

      if (!checkVehicleModel) {
        throw new NotFoundException({
          statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'user-vehicle.error.notFound',
        });
      }
    }
    try {
      await this.userVehicleService.update(userVehicle, body, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }
}
