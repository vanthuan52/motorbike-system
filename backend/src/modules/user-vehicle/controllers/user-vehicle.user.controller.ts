import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';

import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  UserVehicleUserCreateDoc,
  UserVehicleUserDeleteDoc,
  UserVehicleUserGetDoc,
  UserVehicleUserListDoc,
  UserVehicleUserUpdateDoc,
} from '../docs/user-vehicle.user.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '../enums/user-vehicle.status-code.enum';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import { UserVehicleDoc } from '../entities/user-vehicle.entity';
import {
  USER_VEHICLE_DEFAULT_AVAILABLE_ORDER_BY,
  USER_VEHICLE_DEFAULT_AVAILABLE_SEARCH,
} from '../constants/user-vehicle.list.constant';
import { UserVehicleService } from '../services/user-vehicle.service';
import {
  IUserVehicleDoc,
  IUserVehicleEntity,
} from '../interfaces/user-vehicle.interface';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { UserVehicleParsePipe } from '../pipes/user-vehicle.parse.pipe';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { UserService } from '@/modules/user/services/user.service';

@ApiTags('modules.user.vehicle-model')
@Controller({
  version: '1',
  path: '/vehicle-model',
})
export class UserVehicleUserController {
  constructor(
    private readonly vehicleModelService: VehicleBrandService,
    private readonly userService: UserService,
    private readonly userVehicleService: UserVehicleService,
    private readonly paginationService: PaginationService,
  ) {}

  @UserVehicleUserListDoc()
  @ResponsePaging('vehicle-model.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
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

    const userVehicles: IUserVehicleEntity[] =
      await this.userVehicleService.findAllWithVehicleModel(find, {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      });

    const total: number =
      await this.userVehicleService.getTotalWithVehicleModel(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.userVehicleService.mapList(userVehicles);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @UserVehicleUserGetDoc()
  @Response('vehicle-model.get')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
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

  @UserVehicleUserCreateDoc()
  @Response('vehicle-model.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
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

  @UserVehicleUserUpdateDoc()
  @Response('vehicle-model.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
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
          message: 'vehicle-model.error.notFound',
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

  @UserVehicleUserDeleteDoc()
  @Response('vehicle-model.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.USER)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, UserVehicleParsePipe)
    userVehicle: UserVehicleDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.userVehicleService.delete(userVehicle);
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'vehicle-model.error.deleteFailed',
        _error: err,
      });
    }
  }
}
