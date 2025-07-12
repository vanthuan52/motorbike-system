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
import { AppointmentsService } from '../services/appointment.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { UserService } from '@/modules/user/services/user.service';
import { VehicleBrandService } from '@/modules/vehicle-brand/services/vehicle-brand.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import { ServiceCategoryService } from '@/modules/service-category/services/service-category.services';
import {
  AppointmentsAdminCreateDoc,
  AppointmentsAdminDeleteDoc,
  AppointmentsAdminListDoc,
  AppointmentsAdminParamsIdDoc,
  AppointmentsAdminUpdateDoc,
  AppointmentsAdminUpdateStatusDoc,
} from '../docs/appointment.admin.doc';
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
  APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY,
  APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH,
  APPOINTMENTS_DEFAULT_STATUS,
} from '../constants/appointment.list.constant';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import { ENUM_APPOINTMENTS_STATUS } from '../enums/appointment.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { AppointmentsListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentsGetResponseDto } from '../dtos/response/appointment.get.response.dto';
import { AppointmentsCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentsUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { ENUM_APPOINTMENTS_STATUS_CODE_ERROR } from '../enums/appointment.status-code.enum';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { AppointmentsUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { AppointmentsParsePipe } from '../pipes/appointment.parse.pipe';
import { AppointmentsDoc } from '../entities/appointment.entity';
import { ENUM_USER_STATUS_CODE_ERROR } from '@/modules/user/enums/user.status-code.enum';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '@/modules/service-category/enums/service-category.status-code.enum';
import { IAppointmentsDoc } from '../interfaces/appointment.interface';

@ApiTags('modules.admin.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentsAdminController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly vehicleBrandService: VehicleBrandService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  @AppointmentsAdminListDoc()
  @ResponsePaging('appointment.list')
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
      availableSearch: APPOINTMENTS_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: APPOINTMENTS_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @PaginationQueryFilterInEnum(
      'status',
      APPOINTMENTS_DEFAULT_STATUS,
      ENUM_APPOINTMENTS_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<AppointmentsListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const Appointments = await this.appointmentsService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number = await this.appointmentsService.getTotal(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.appointmentsService.mapList(Appointments);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @AppointmentsAdminParamsIdDoc()
  @Response('appointment.getById')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, AppointmentsParsePipe)
    appointment: AppointmentsDoc,
  ): Promise<IResponse<AppointmentsGetResponseDto>> {
    const AppointmentsWithCategory: IAppointmentsDoc =
      await this.appointmentsService.join(appointment);

    const mapped: AppointmentsGetResponseDto = this.appointmentsService.mapGet(
      AppointmentsWithCategory,
    );
    return { data: mapped };
  }

  @AppointmentsAdminCreateDoc()
  @Response('appointment.create')
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
    @Body() body: AppointmentsCreateRequestDto,
  ): Promise<any> {
    const promises: Promise<any>[] = [
      this.vehicleBrandService.findOneById(body.vehicleBrand),
      this.vehicleModelService.findOneById(body.vehicleModel),
    ];
    const [existingVehicleBrand, existingVehicleModel] =
      await Promise.all(promises);

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
      const created = await this.appointmentsService.create(body, {
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

  @AppointmentsAdminUpdateDoc()
  @Response('appointment.update')
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
    @Body() body: AppointmentsUpdateRequestDto,
  ): Promise<any> {
    const promises: Promise<any>[] = [
      this.vehicleBrandService.findOneById(body.vehicleBrand!),
      this.vehicleModelService.findOneById(body.vehicleModel!),
      this.appointmentsService.findOneById(id),
    ];
    const [existingVehicleBrand, existingVehicleModel, appointment] =
      await Promise.all(promises);

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

    if (!appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENTS_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }
    try {
      await this.appointmentsService.update(appointment, body, {
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

  @AppointmentsAdminUpdateStatusDoc()
  @Response('appointment.updateStatus')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, AppointmentsParsePipe)
    appointment: AppointmentsDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: AppointmentsUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.appointmentsService.updateStatus(appointment, { status }, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
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
        message: 'appointment.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @AppointmentsAdminDeleteDoc()
  @Response('appointment.delete')
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.USER,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @PolicyRoleProtected(ENUM_POLICY_ROLE_TYPE.ADMIN)
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, AppointmentsParsePipe)
    appointment: AppointmentsDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<void> {
    try {
      await this.appointmentsService.softDelete(appointment, {
        actionBy: updatedBy,
      } as IDatabaseSaveOptions);
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'appointment.error.deleteFailed',
        _error: err,
      });
    }
  }
}
