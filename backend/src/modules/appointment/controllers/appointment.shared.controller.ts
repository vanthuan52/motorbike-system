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
import { AppointmentService } from '../services/appointment.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { UserService } from '@/modules/user/services/user.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';

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
import { ENUM_APPOINTMENT_STATUS } from '../enums/appointment.enum';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentGetResponseDto } from '../dtos/response/appointment.get.response.dto';
import { AppointmentCreateRequestDto } from '../dtos/request/appointment.create.request.dto';
import { AppointmentUpdateStatusRequestDto } from '../dtos/request/appointment.update-status.request.dto';
import { ENUM_APPOINTMENT_STATUS_CODE_ERROR } from '../enums/appointment.status-code.enum';
import {
  IDatabaseCreateOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ENUM_APP_STATUS_CODE_ERROR } from '@/app/enums/app.status-code.num';
import { AppointmentUpdateRequestDto } from '../dtos/request/appointment.update.request.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { AppointmentsParsePipe } from '../pipes/appointment.parse.pipe';
import { AppointmentDoc } from '../entities/appointment.entity';
import { ENUM_VEHICLE_BRAND_STATUS_CODE_ERROR } from '@/modules/vehicle-brand/enums/vehicle-brand.status-code.enum';
import { ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR } from '@/modules/vehicle-model/enums/vehicle-model.status-code.enum';
import { ENUM_SERVICE_CATEGORY_STATUS_CODE_ERROR } from '@/modules/service-category/enums/service-category.status-code.enum';
import { IAppointmentDoc } from '../interfaces/appointment.interface';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { AppointmentGetFullResponseDto } from '../dtos/response/appointment.full.response.dto';
import { ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR } from '@/modules/vehicle-service/enums/vehicle-service.status-code.enum';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import {
  AppointmentSharedCreateDoc,
  AppointmentSharedDeleteDoc,
  AppointmentSharedListDoc,
  AppointmentSharedParamsIdDoc,
  AppointmentSharedUpdateDoc,
  AppointmentSharedUpdateStatusDoc,
} from '../docs/appointment.shared.doc';

@ApiTags('modules.shared.appointment')
@Controller({
  version: '1',
  path: '/appointment',
})
export class AppointmentSharedController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly vehicleModelService: VehicleModelService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly userVehicleService: UserVehicleService,
  ) {}

  @AppointmentSharedListDoc()
  @ResponsePaging('appointment.list')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
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
      ENUM_APPOINTMENT_STATUS,
    )
    status: Record<string, any>,
  ): Promise<IResponsePaging<AppointmentListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
    };

    const appointments = await this.appointmentService.findAllWithVehicleModel(
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
      await this.appointmentService.getTotalWithVehicleModel(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.appointmentService.mapList(appointments);

    return {
      _pagination: { total, totalPage },
      data: mapped,
    };
  }

  @AppointmentSharedParamsIdDoc()
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
    appointment: AppointmentDoc,
  ): Promise<IResponse<AppointmentGetResponseDto>> {
    const appointmentFull: IAppointmentDoc =
      await this.appointmentService.join(appointment);

    const mapped: AppointmentGetResponseDto =
      this.appointmentService.mapGet(appointmentFull);
    return { data: mapped };
  }

  @AppointmentSharedCreateDoc()
  @Response('appointment.create')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create')
  async create(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: AppointmentCreateRequestDto,
  ): Promise<any> {
    const { userVehicle, vehicleModel, vehicleServices } = body;

    const foundVehicleModel =
      await this.vehicleModelService.findOneById(vehicleModel);
    if (!foundVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    if (userVehicle) {
      const foundUserVehicle =
        await this.userVehicleService.findOneById(userVehicle);
      if (!foundUserVehicle) {
        throw new NotFoundException({
          statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
          message: 'user-vehicle.error.notFound',
        });
      }
    }

    await Promise.all(
      vehicleServices.map(async (id) => {
        const service = await this.vehicleServiceService.findOneById(id);
        if (!service) {
          throw new NotFoundException({
            statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
            message: 'vehicle-service.error.notFound',
          });
        }
      }),
    );

    try {
      const created = await this.appointmentService.create(body, {
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

  @AppointmentSharedUpdateDoc()
  @Response('appointment.update')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id') id: string,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: AppointmentUpdateRequestDto,
  ): Promise<any> {
    const { userVehicle, vehicleModel, vehicleServices } = body;

    const [appointment, foundUserVehicle, foundVehicleModel] =
      await Promise.all([
        this.appointmentService.findOneById(id),
        userVehicle
          ? this.userVehicleService.findOneById(userVehicle)
          : Promise.resolve(null),
        vehicleModel
          ? this.vehicleModelService.findOneById(vehicleModel)
          : Promise.resolve(null),
      ]);

    if (!appointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }

    if (userVehicle && !foundUserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    if (vehicleModel && !foundVehicleModel) {
      throw new NotFoundException({
        statusCode: ENUM_VEHICLE_MODEL_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'vehicle-model.error.notFound',
      });
    }

    if (vehicleServices?.length) {
      await Promise.all(
        vehicleServices.map(async (id) => {
          const service = await this.vehicleServiceService.findOneById(id);
          if (!service) {
            throw new NotFoundException({
              statusCode: ENUM_VEHICLE_SERVICE_STATUS_CODE_ERROR.NOT_FOUND,
              message: 'vehicle-service.error.notFound',
            });
          }
        }),
      );
    }

    try {
      await this.appointmentService.update(appointment, body, {
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

  @AppointmentSharedUpdateStatusDoc()
  @Response('appointment.updateStatus')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, AppointmentsParsePipe)
    appointment: AppointmentDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: AppointmentUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.appointmentService.updateStatus(appointment, { status }, {
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

  @AppointmentSharedDeleteDoc()
  @Response('appointment.delete')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, AppointmentsParsePipe)
    appointment: AppointmentDoc,
    @AuthJwtPayload('user') updatedBy: string,
  ): Promise<void> {
    try {
      await this.appointmentService.softDelete(appointment, {
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
