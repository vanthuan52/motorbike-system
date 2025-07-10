import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaintenanceScheduleService } from '../services/maintenance-schedule.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { UserService } from '@/modules/user/services/user.service';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ServiceCategoryService } from '@/modules/service-category/services/service-category.services';
import {
  MaintenanceScheduleAdminCreateDoc,
  MaintenanceScheduleAdminDeleteDoc,
  MaintenanceScheduleAdminListDoc,
  MaintenanceScheduleAdminParamsIdDoc,
  MaintenanceScheduleAdminUpdateDoc,
  MaintenanceScheduleAdminUpdateStatusDoc,
} from '../docs/maintenance-schedule.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  PolicyAbilityProtected,
  PolicyRoleProtected,
} from '@/modules/policy/decorators/policy.decorator';
import {
  ENUM_POLICY_ACTION,
  ENUM_POLICY_ROLE_TYPE,
  ENUM_POLICY_SUBJECT,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_ORDER_BY,
  MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_SEARCH,
  MAINTENANCE_SCHEDULE_DEFAULT_STATUS,
} from '../constants/maintenance-schedule.list.constant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS } from '../enums/maintenance-schedule.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { MaintenanceScheduleListResponseDto } from '../dtos/response/maintenance-schedule.list.response.dto';
import { MaintenanceScheduleGetResponseDto } from '../dtos/response/maintenance-schedule.get.response.dto';
import { MaintenanceScheduleCreateRequestDto } from '../dtos/request/maintenance-schedule.create.request.dto';
import { MaintenanceScheduleUpdateStatusRequestDto } from '../dtos/request/maintenance-schedule.update-status.request.dto';
import { ENUM_MAINTENANCE_SCHEDULE_STATUS_CODE_ERROR } from '../enums/maintenance-schedule.status-code.enum';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { MaintenanceScheduleUpdateRequestDto } from '../dtos/request/maintenance-schedule.update.request.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { MaintenanceScheduleParsePipe } from '../pipes/maintenance-schedule.parse.pipe';
import { MaintenanceScheduleDoc } from '../entities/maintenance-schedule.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '@/modules/service-category/enums/service-category.status-code.enum';
import { IMaintenanceScheduleDoc } from '../interfaces/maintenance-schedule.interface';

@ApiTags('modules.admin.maintenance-schedule')
@Controller({
  version: '1',
  path: '/maintenance-schedule',
})
export class MaintenanceScheduleAdminController {
  constructor(
    private readonly maintenanceScheduleService: MaintenanceScheduleService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @MaintenanceScheduleAdminListDoc()
  @ResponsePaging('maintenance-schedule.list')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery({
      availableSearch: MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: MAINTENANCE_SCHEDULE_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      MAINTENANCE_SCHEDULE_DEFAULT_STATUS,
      ENUM_MAINTENANCE_SCHEDULE_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<MaintenanceScheduleListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const maintenanceSchedules = await this.maintenanceScheduleService.findAll(
      find,
      {
        paging: {
          limit: _limit,
          offset: _offset,
        },
        order: _order,
      },
    );

    const total: number = await this.maintenanceScheduleService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped =
      this.maintenanceScheduleService.mapList(maintenanceSchedules);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @MaintenanceScheduleAdminParamsIdDoc()
  @Response('maintenance-schedule.getById')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, MaintenanceScheduleParsePipe)
    maintenanceSchedule: MaintenanceScheduleDoc,
  ): Promise<IResponse<MaintenanceScheduleGetResponseDto>> {
    const maintenanceScheduleWithCategory: IMaintenanceScheduleDoc =
      await this.maintenanceScheduleService.join(maintenanceSchedule);

    const mapped: MaintenanceScheduleGetResponseDto =
      this.maintenanceScheduleService.mapGet(maintenanceScheduleWithCategory);
    return { data: mapped };
  }

  @MaintenanceScheduleAdminCreateDoc()
  @Response('maintenance-schedule.create')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: MaintenanceScheduleCreateRequestDto,
  ): Promise<any> {
    const promises: Promise<any>[] = [
      this.userService.findOneWithRoleById(body.staff!),
      this.vehicleBrandService.findOneById(body.vehicleBrand),
      this.vehicleModelService.findOneById(body.vehicleModel),
    ];
    const [existingStaff, existingVehicleBrand, existingVehicleModel] =
      await Promise.all(promises);

    if (!existingStaff) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!existingVehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }

    if (!existingVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    for (const categoryId of body.serviceCategory) {
      const existing =
        await this.serviceCategoryService.findOneById(categoryId);
      if (!existing) {
        throw new NotFoundException({
          message: 'service-category.error.notFound',
        });
      }
    }
    try {
      const created = await this.maintenanceScheduleService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);
      return { data: { _id: created._id } };
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @MaintenanceScheduleAdminUpdateDoc()
  @Response('maintenance-schedule.update')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: MaintenanceScheduleUpdateRequestDto,
  ): Promise<any> {
    const promises: Promise<any>[] = [
      this.userService.findOneById(body.staff!),
      this.vehicleBrandService.findOneById(body.vehicleBrand!),
      this.vehicleModelService.findOneById(body.vehicleModel!),
      this.maintenanceScheduleService.findOneById(id),
    ];
    const [
      existingStaff,
      existingVehicleBrand,
      existingVehicleModel,
      maintenanceSchedule,
    ] = await Promise.all(promises);

    if (!existingStaff) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user.error.notFound',
      });
    }

    if (!existingVehicleBrand) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-brand.error.notFound',
      });
    }

    if (!existingVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    for (const categoryId of body.serviceCategory!) {
      const existing =
        await this.serviceCategoryService.findOneById(categoryId);
      if (!existing) {
        throw new NotFoundException({
          statusCode: ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'service-category.error.notFound',
        });
      }
    }

    if (!maintenanceSchedule) {
      throw new NotFoundException({
        statusCode: ENUM_MAINTENANCE_SCHEDULE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'maintenance-schedule.error.notFound',
      });
    }
    try {
      await this.maintenanceScheduleService.update(maintenanceSchedule, body, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @MaintenanceScheduleAdminUpdateStatusDoc()
  @Response('maintenance-schedule.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, MaintenanceScheduleParsePipe)
    maintenanceSchedule: MaintenanceScheduleDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: MaintenanceScheduleUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.maintenanceScheduleService.updateStatus(
        maintenanceSchedule,
        { status },
        { actionBy: updatedBy } as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              status: status.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'maintenance-schedule.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @MaintenanceScheduleAdminDeleteDoc()
  @Response('maintenance-schedule.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, MaintenanceScheduleParsePipe)
    maintenanceSchedule: MaintenanceScheduleDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<void> {
    try {
      await this.maintenanceScheduleService.softDelete(maintenanceSchedule, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'maintenance-schedule.error.deleteFailed',
        _error: err,
      });
    }
  }
}
