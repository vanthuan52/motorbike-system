import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseDeleteOptions,
  IDatabaseFindAllAggregateOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ICareRecordService } from '../interfaces/care-record.service.interface';
import { CareRecordRepository } from '../respository/care-record.repository';
import {
  CareRecordDoc,
  CareRecordEntity,
} from '../entities/care-record.entity';
import { ICareRecordEntity } from '../interfaces/care-record.interface';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  ENUM_CARE_RECORD_STATUS,
  ENUM_PAYMENT_STATUS,
} from '../enums/care-record.enum';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import { CareRecordUtil } from '../utils/care-record.util';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_CARE_RECORD_STATUS_CODE_ERROR } from '../enums/care-record.status-code.enum';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { CareRecordServiceService } from '@/modules/care-record-service/services/care-record-service.service';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { ENUM_CARE_RECORD_SERVICE_TYPE } from '@/modules/care-record-service/enums/care-record-service.enum';
import { CareRecordServiceCreateRequestDto } from '@/modules/care-record-service/dtos/request/care-record-service.create.request.dto';
import { CareRecordChecklistCreateRequestDto } from '@/modules/care-record-checklist/dtos/request/care-record-checklist.create.request.dto';
import { AppointmentService } from '@/modules/appointment/services/appointment.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { ENUM_APPOINTMENT_STATUS_CODE_ERROR } from '@/modules/appointment/enums/appointment.status-code.enum';
import { ENUM_USER_VEHICLE_STATUS_CODE_ERROR } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';

@Injectable()
export class CareRecordService implements ICareRecordService {
  constructor(
    private readonly careRecordRepository: CareRecordRepository,
    private readonly careRecordUtil: CareRecordUtil,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly appointmentService: AppointmentService,
    private readonly userVehicleService: UserVehicleService,
  ) {}

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
    options?: IDatabaseFindAllAggregateOptions,
  ): Promise<{ data: ICareRecordEntity[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [careRecords, total] = await Promise.all([
      this.careRecordRepository.findAll<ICareRecordEntity>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
        ...options,
        join: true,
      }),
      this.careRecordRepository.getTotal(find, { ...options, join: true }),
    ]);

    return {
      data: careRecords,
      total,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc> {
    const careRecord = await this.findOneByIdOrFail(id, {
      ...options,
      join: true,
    });
    return careRecord;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc> {
    const careRecord = await this.careRecordRepository.findOne<CareRecordDoc>(
      find,
      options,
    );
    return careRecord;
  }

  async create(
    {
      appointment,
      userVehicle,
      vehicleModelName,
      technician,
      store,
      confirmedByOwner,
    }: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc> {
    const create: CareRecordEntity = new CareRecordEntity();
    create.appointment = appointment;
    create.userVehicle = userVehicle;
    create.vehicleModelName = vehicleModelName;
    create.technician = technician;
    create.store = store;
    create.confirmedByOwner = confirmedByOwner ? confirmedByOwner : false;
    create.status = ENUM_CARE_RECORD_STATUS.PENDING;
    create.paymentStatus = ENUM_PAYMENT_STATUS.UNPAID;

    const created = await this.careRecordRepository.create<CareRecordEntity>(
      create,
      options,
    );

    return created;
  }

  /**
   * Create care record with full validation and auto-creation of services
   * Validates appointment and userVehicle existence, then creates care record
   * and auto-creates care-record-services from appointment
   */
  async createWithAppointment(
    body: CareRecordCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordDoc> {
    const checkAppointment = await this.appointmentService.findOneById(
      body.appointment,
    );
    const checkUserVehicle = await this.userVehicleService.findOneById(
      body.userVehicle,
    );

    if (!checkAppointment?.data) {
      throw new NotFoundException({
        statusCode: ENUM_APPOINTMENT_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'appointment.error.notFound',
      });
    }
    if (!checkUserVehicle) {
      throw new NotFoundException({
        statusCode: ENUM_USER_VEHICLE_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'user-vehicle.error.notFound',
      });
    }

    // Create care record
    const result = await this.create(body, options);

    // Auto create care-record-services from appointment
    await this.createCareRecordServices(
      checkAppointment.data,
      result._id,
      options?.actionBy || '',
    );

    return result;
  }

  async update(
    id: string,
    { confirmedByOwner }: CareRecordUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.confirmedByOwner =
      confirmedByOwner ?? repository.confirmedByOwner;

    await this.careRecordRepository.save(repository, options);
    return;
  }

  async updateStatus(
    id: string,
    { status }: CareRecordUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.status = status;

    await this.careRecordRepository.save(repository, options);
    return;
  }

  async updatePaymentStatus(
    id: string,
    { paymentStatus }: CareRecordUpdatePaymentStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.paymentStatus = paymentStatus;

    await this.careRecordRepository.save(repository, options);
    return;
  }

  async updateTechnician(
    id: string,
    { technician }: CareRecordUpdateTechnicianRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.technician = technician;

    await this.careRecordRepository.save(repository, options);
    return;
  }

  async delete(id: string, options?: IDatabaseDeleteOptions): Promise<void> {
    await this.careRecordRepository.delete({ _id: id }, options);
    return;
  }

  async softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.careRecordRepository.softDelete(repository, options);
    return;
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.careRecordRepository.deleteMany(find, options);
    return true;
  }

  async createCareRecordServices(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void> {
    const createOptions: IDatabaseCreateOptions = { actionBy: createdBy };
    const allServiceDtos: CareRecordServiceCreateRequestDto[] = [];

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

    if (appointment.vehicleServices && appointment.vehicleServices.length > 0) {
      const vehicleServices = await Promise.all(
        appointment.vehicleServices.map((id: string) =>
          this.vehicleServiceService.findOneById(id),
        ),
      );

      const vehicleServiceDtos = vehicleServices
        .filter((service) => service !== null || service !== undefined)
        .map((service) => ({
          careRecord: careRecordId,
          name: service.name,
          vehicleService: service._id,
          type: ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE, // Fixed: was type
        }));

      allServiceDtos.push(...vehicleServiceDtos);
    }

    if (allServiceDtos.length > 0) {
      await this.careRecordServiceService.createMany(
        allServiceDtos,
        createOptions,
      );

      await this.createCareRecordChecklists(
        appointment,
        careRecordId,
        createdBy,
      );
    }
  }

  async createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    createdBy: string,
  ): Promise<void> {
    const createOptions: IDatabaseCreateOptions = { actionBy: createdBy };
    const allChecklistDtos: CareRecordChecklistCreateRequestDto[] = [];

    const { data: careRecordServices } =
      await this.careRecordServiceService.getListOffset({
        limit: 100, // Assuming reasonable limit
        skip: 0,
        where: { careRecord: careRecordId },
      });

    for (const careRecordService of careRecordServices) {
      if (
        careRecordService.type === ENUM_CARE_RECORD_SERVICE_TYPE.SERVICE &&
        careRecordService.vehicleService
      ) {
        // Handle populated vehicleService
        const vehicleServiceId =
          (careRecordService.vehicleService as any)._id ||
          careRecordService.vehicleService;

        const vehicleService = await this.vehicleServiceService.findOneById(
          vehicleServiceId,
          { join: true },
        );

        if (vehicleService) {
          if (
            vehicleService.checklistItems &&
            vehicleService.checklistItems.length > 0
          ) {
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
            const vehicleServiceChecklistDto: CareRecordChecklistCreateRequestDto =
              {
                careRecordService: careRecordService._id,
                name: vehicleService.name,
                wearPercentage: 100,
              };
            allChecklistDtos.push(vehicleServiceChecklistDto);
          }
        }
      } else if (
        careRecordService.type ===
        ENUM_CARE_RECORD_SERVICE_TYPE.CUSTOMER_REQUEST
      ) {
        const customerRequestChecklistDto: CareRecordChecklistCreateRequestDto =
          {
            careRecordService: careRecordService._id,
            name: careRecordService.name,
            wearPercentage: 100,
          };
        allChecklistDtos.push(customerRequestChecklistDto);
      }
    }

    if (allChecklistDtos.length > 0) {
      await this.careRecordChecklistService.createMany(
        allChecklistDtos,
        createOptions,
      );
    }
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordDoc> {
    const careRecord =
      await this.careRecordRepository.findOneById<CareRecordDoc>(id, options);
    if (!careRecord) {
      throw new NotFoundException({
        statusCode: ENUM_CARE_RECORD_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'care-record.error.notFound',
      });
    }
    return careRecord;
  }
}
