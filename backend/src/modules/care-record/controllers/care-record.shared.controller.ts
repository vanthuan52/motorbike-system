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
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CareRecordService } from '../services/care-record.service';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import { PaginationListDto } from '@/common/pagination/dtos/pagination.list.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponse,
  IResponsePaging,
} from '@/common/response/interfaces/response.interface';
import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import {
  PaginationQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  CareRecordSharedCreateDoc,
  CareRecordSharedDeleteDoc,
  CareRecordSharedListDoc,
  CareRecordSharedParamsIdDoc,
  CareRecordSharedUpdateDoc,
  CareRecordSharedUpdateStatusDoc,
  CareRecordSharedUpdatePaymentStatusDoc,
  CareRecordSharedUpdateTechnicianDoc,
  CareRecordSharedCreateChecklistDoc,
} from '../docs/care-record.shared.doc';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '../enums/care-record.status-code.enum';
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
import {
  CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
  CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
  CARE_RECORD_DEFAULT_PAYMENT_STATUS,
  CARE_RECORD_DEFAULT_STATUS,
} from '../constants/care-record.list.constant';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { CareRecordParsePipe } from '../pipes/care-record.parse.pipe';
import { CareRecordDoc } from '../entities/care-record.entity';
import { ICareRecordDoc } from '../interfaces/care-record.interface';
import { OptionalParseUUIDPipe } from '@/app/pipes/optional-parse-uuid.pipe';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { CareRecordServiceService } from '@/modules/care-record-service/services/care-record-service.service';
import { ENUM_CARE_RECORD_SERVICE_TYPE } from '@/modules/care-record-service/enums/care-record-service.enum';
import { CareRecordServiceCreateRequestDto } from '@/modules/care-record-service/dtos/request/care-record-service.create.request.dto';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { CareRecordChecklistCreateRequestDto } from '@/modules/care-record-checklist/dtos/request/care-record-checklist.create.request.dto';
import { ServiceChecklistService } from '@/modules/service-checklist/services/service-checklist.service';
import { VehicleModelService } from '@/modules/vehicle-model/services/vehicle-model.service';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';
import { AppointmentService } from '@/modules/appointment/services/appointment.service';
import { UserService } from '@/modules/user/services/user.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { ENUM_APPOINTMENT_STATUS_CODE_ERROR } from '@/modules/appointment/enums/appointment.status-code.enum';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';

@ApiTags('modules.shared.care-record')
@Controller({
  version: '1',
  path: '/care-record',
})
export class CareRecordSharedController {
  private readonly logger = new Logger(CareRecordSharedController.name);
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly userService: UserService,
    private readonly userVehicleService: UserVehicleService,
    private readonly careRecordService: CareRecordService,
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly serviceChecklistService: ServiceChecklistService,
    private readonly paginationService: PaginationService,
  ) {}

  @CareRecordSharedListDoc()
  @ResponsePaging('care-record.list')
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
      availableSearch: CARE_RECORD_DEFAULT_AVAILABLE_SEARCH,
      availableOrderBy: CARE_RECORD_DEFAULT_AVAILABLE_ORDER_BY,
    })
    { _search, _limit, _offset, _order }: PaginationListDto,
    @Query('appointment', OptionalParseUUIDPipe)
    appointmentId: string,
    @PaginationQueryFilterInEnum(
      'status',
      CARE_RECORD_DEFAULT_STATUS,
      ENUM_CARE_RECORD_STATUS,
    )
    status: Record<string, any>,
    @PaginationQueryFilterInEnum(
      'paymentStatus',
      CARE_RECORD_DEFAULT_PAYMENT_STATUS,
      ENUM_PAYMENT_STATUS,
    )
    paymentStatus: Record<string, any>,
    @Query('technician', OptionalParseUUIDPipe)
    technicianId: string,
    @Query('userVehicle', OptionalParseUUIDPipe)
    userVehicleId: string,
  ): Promise<IResponsePaging<CareRecordListResponseDto>> {
    const find: Record<string, any> = {
      ..._search,
      ...status,
      ...paymentStatus,
    };

    if (appointmentId) {
      find['appointment._id'] = appointmentId;
    }

    if (technicianId) {
      find['technician._id'] = technicianId;
    }

    if (userVehicleId) {
      find['userVehicle._id'] = userVehicleId;
    }

    const careRecords = await this.careRecordService.findAllWithPopulate(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    });

    const total: number =
      await this.careRecordService.getTotalWithPopulate(find);

    const totalPage: number = this.paginationService.totalPage(total, _limit);

    const mapped = this.careRecordService.mapList(careRecords);

    return {
      _pagination: {
        total,
        totalPage,
      },
      data: mapped,
    };
  }

  @CareRecordSharedParamsIdDoc()
  @Response('care-record.get')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    CareRecord: CareRecordDoc,
  ): Promise<IResponse<CareRecordGetResponseDto>> {
    const CareRecordFull: ICareRecordDoc =
      await this.careRecordService.join(CareRecord);

    const mapped: CareRecordGetResponseDto =
      this.careRecordService.mapGet(CareRecordFull);
    return { data: mapped };
  }

  @CareRecordSharedCreateDoc()
  @Response('care-record.create')
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
    @Body() body: CareRecordCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.appointmentService.findOneById(body.appointment),
      this.userVehicleService.findOneById(body.userVehicle),
    ];
    const [checkAppointment, checkUserVehicle] = await Promise.all(promises);

    if (!checkAppointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    } else if (!checkUserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    try {
      const created = await this.careRecordService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);

      // Auto create care-record-services from appointment
      await this.createCareRecordServices(
        checkAppointment,
        created._id,
        createdBy,
      );

      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordSharedUpdateDoc()
  @Response('care-record.update')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Put('/update/:id')
  async update(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    careRecord: CareRecordDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() body: CareRecordUpdateRequestDto,
  ): Promise<void> {
    try {
      await this.careRecordService.update(careRecord, body, {
        actionBy: updatedBy,
      });
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  @CareRecordSharedUpdateStatusDoc()
  @Response('care-record.updateStatus')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    careRecord: CareRecordDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { status }: CareRecordUpdateStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordService.updateStatus(careRecord, { status }, {
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
        message: 'care-record.error.updateStatusFailed',
        _error: err,
      });
    }
  }

  @CareRecordSharedUpdatePaymentStatusDoc()
  @Response('care-record.updatePaymentStatus')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/paymentStatus')
  async updatePaymentStatus(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    careRecord: CareRecordDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { paymentStatus }: CareRecordUpdatePaymentStatusRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordService.updatePaymentStatus(
        careRecord,
        { paymentStatus },
        {
          actionBy: updatedBy,
        } as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              paymentStatus: paymentStatus.toLowerCase(),
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'care-record.error.updatePaymentStatusFailed',
        _error: err,
      });
    }
  }

  @CareRecordSharedUpdateTechnicianDoc()
  @Response('care-record.updateTechnician')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Patch('/update/:id/technician')
  async updateTechnician(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    careRecord: CareRecordDoc,
    @AuthJwtPayload('user') updatedBy: string,
    @Body() { technician }: CareRecordUpdateTechnicianRequestDto,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordService.updateTechnician(
        careRecord,
        { technician },
        {
          actionBy: updatedBy,
        } as IDatabaseSaveOptions,
      );
      return {
        _metadata: {
          customProperty: {
            messageProperties: {
              technician,
            },
          },
        },
      };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'care-record.error.updateTechnicianFailed',
        _error: err,
      });
    }
  }

  @CareRecordSharedDeleteDoc()
  @Response('care-record.delete')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/delete/:id')
  async delete(
    @Param('id', RequestRequiredPipe, CareRecordParsePipe)
    careRecord: CareRecordDoc,
  ): Promise<IResponse<void>> {
    try {
      await this.careRecordService.softDelete(
        careRecord,
        {} as IDatabaseDeleteOptions,
      );
      return {};
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'care-record.error.deleteFailed',
        _error: err,
      });
    }
  }

  @CareRecordSharedCreateChecklistDoc()
  @Response('care-record.createChecklist')
  @PolicyRoleProtected(
    ENUM_POLICY_ROLE_TYPE.ADMIN,
    ENUM_POLICY_ROLE_TYPE.MANAGER,
    ENUM_POLICY_ROLE_TYPE.TECHNICIAN,
  )
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/create/:id/checklist')
  async createChecklist(
    @AuthJwtPayload('user') createdBy: string,
    @Body() body: CareRecordCreateRequestDto,
  ): Promise<IResponse<DatabaseIdResponseDto>> {
    const promises: Promise<any>[] = [
      this.appointmentService.findOneById(body.appointment),
      this.userVehicleService.findOneById(body.userVehicle),
    ];
    const [checkAppointment, checkUserVehicle] = await Promise.all(promises);

    if (!checkAppointment) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    } else if (!checkUserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    try {
      const created = await this.careRecordService.create(body, {
        actionBy: createdBy,
      } as IDatabaseCreateOptions);

      // Tự động tạo care-record-services từ appointment
      await this.createCareRecordServices(
        checkAppointment,
        created._id,
        createdBy,
      );

      return { data: { _id: created._id } };
    } catch (err: unknown) {
      throw new InternalServerErrorException({
        statusCode: ENUM_APP_STATUS_CODE_ERROR.UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err,
      });
    }
  }

  /**
   * Auto create care-record-services from appointment
   *
   * Using batch operations
   * Future improvements:
   * 1. Use Redis Queue (Bull/BullMQ) for async processing
   * 2. Return care-record immediately, process services in background
   * 3. Add retry mechanism for failed service creations
   */
  private async createCareRecordServices(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void> {
    const createOptions: IDatabaseCreateOptions = { actionBy: createdBy };
    const allServiceDtos: CareRecordServiceCreateRequestDto[] = [];

    // Prepare customer request DTOs
    if (
      appointment.customerRequests &&
      appointment.customerRequests.length > 0
    ) {
      const customerRequestDtos = appointment.customerRequests.map(
        (request: string) => ({
          careRecord: careRecordId,
          name: request,
          type: ENUM_CARE_RECORD_SERVICE_TYPE.CUSTOMER_REQUEST,
        }),
      );

      allServiceDtos.push(...customerRequestDtos);
    }

    // Batch fetch vehicleServices, then prepare DTOs
    if (appointment.vehicleServices && appointment.vehicleServices.length > 0) {
      // Batch fetch all vehicle services at once
      const vehicleServices = await Promise.all(
        appointment.vehicleServices.map((id: string) =>
          this.vehicleServiceService.findOneById(id),
        ),
      );

      // Prepare DTOs for valid services
      const vehicleServiceDtos = vehicleServices
        .filter((service) => service !== null || service !== undefined)
        .map((service) => ({
          careRecord: careRecordId,
          name: service.name,
          vehicleService: service._id,
          type: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE,
        }));

      allServiceDtos.push(...vehicleServiceDtos);
    }

    // Single batch insert for all services
    if (allServiceDtos.length > 0) {
      await this.careRecordServiceService.createMany(
        allServiceDtos,
        createOptions,
      );

      // Create care-record-checklists for services with vehicleService
      await this.createCareRecordChecklists(
        appointment,
        careRecordId,
        createdBy,
      );
    }
  }

  /**
   * Auto create care-record-checklists for each care-record-service
   *
   * PERFORMANCE NOTE: This creates many database operations
   * - For each vehicleService: fetch checklistItems + create multiple checklists
   * - Could be optimized with batch operations or async queue in the future
   */
  private async createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void> {
    const createOptions: IDatabaseCreateOptions = { actionBy: createdBy };
    const allChecklistDtos: CareRecordChecklistCreateRequestDto[] = [];

    // Get all care-record-services for this care-record
    const careRecordServices = await this.careRecordServiceService.findAll({
      careRecord: careRecordId,
    });

    for (const careRecordService of careRecordServices) {
      if (
        careRecordService.type === ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE &&
        careRecordService.vehicleService
      ) {
        // Handle vehicleService checklists
        const vehicleService = await this.vehicleServiceService.findOneById(
          careRecordService.vehicleService,
          { join: true },
        );

        if (vehicleService) {
          if (vehicleService.checklistItems && vehicleService.checklistItems.length > 0) {
            // Create checklists from checklistItems templates
            const serviceChecklistDtos = vehicleService.checklistItems.map(
              (serviceChecklist: any) => ({
                careRecordService: careRecordService._id,
                serviceChecklist: serviceChecklist._id || serviceChecklist,
                name: serviceChecklist.name || `${careRecordService.name}`,
                wearPercentage: 100,
              }),
            );
            allChecklistDtos.push(...serviceChecklistDtos);
          } else {
            // Create single checklist with vehicleService name when no checklistItems
            const vehicleServiceChecklistDto: CareRecordChecklistCreateRequestDto = {
              careRecordService: careRecordService._id,
              name: vehicleService.name, // Use vehicleService name
              wearPercentage: 100,
            };
            allChecklistDtos.push(vehicleServiceChecklistDto);
          }
        }
      } else if (
        careRecordService.type ===
        ENUM_CARE_RECORD_SERVICE_TYPE.CUSTOMER_REQUEST
      ) {
        // Handle customerRequest checklists
        const customerRequestChecklistDto: CareRecordChecklistCreateRequestDto =
          {
            careRecordService: careRecordService._id,
            name: careRecordService.name, // customerRequest value
            wearPercentage: 100,
          };
        allChecklistDtos.push(customerRequestChecklistDto);
      }
    }

    // Batch create all checklists
    if (allChecklistDtos.length > 0) {
      await this.careRecordChecklistService.createMany(
        allChecklistDtos,
        createOptions,
      );
    }
  }
}
