import { Injectable, NotFoundException } from '@nestjs/common';
import { CareRecordRepository } from '../respository/care-record.repository';
import { ICareRecordService } from '../interfaces/care-record.service.interface';
import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  EnumCareRecordStatus,
  EnumPaymentStatus,
} from '../enums/care-record.enum';
import {
  CareRecordUpdatePaymentStatusRequestDto,
  CareRecordUpdateStatusRequestDto,
} from '../dtos/request/care-record.update-status.request.dto';
import { CareRecordUpdateTechnicianRequestDto } from '../dtos/request/care-record.update-technician.request.dto';
import { CareRecordUtil } from '../utils/care-record.util';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumCareRecordStatusCodeError } from '../enums/care-record.status-code.enum';
import { VehicleServiceService } from '@/modules/vehicle-service/services/vehicle-service.service';
import { CareRecordServiceService } from '@/modules/care-record-service/services/care-record-service.service';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { EnumCareRecordServiceType } from '@/modules/care-record-service/enums/care-record-service.enum';
import { CareRecordServiceCreateRequestDto } from '@/modules/care-record-service/dtos/request/care-record-service.create.request.dto';
import { CareRecordChecklistCreateRequestDto } from '@/modules/care-record-checklist/dtos/request/care-record-checklist.create.request.dto';
import { AppointmentService } from '@/modules/appointment/services/appointment.service';
import { UserVehicleService } from '@/modules/user-vehicle/services/user-vehicle.service';
import { EnumAppointmentStatusCodeError } from '@/modules/appointment/enums/appointment.status-code.enum';
import { EnumUserVehicleStatusCodeError } from '@/modules/user-vehicle/enums/user-vehicle.status-code.enum';
import { CareRecord, Prisma } from '@/generated/prisma-client';
import { IRequestLog } from '@/common/request/interfaces/request.interface';

@Injectable()
export class CareRecordService implements ICareRecordService {
  constructor(
    private readonly careRecordRepository: CareRecordRepository,
    private readonly careRecordUtil: CareRecordUtil,
    private readonly vehicleServiceService: VehicleServiceService,
    private readonly careRecordServiceService: CareRecordServiceService,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly appointmentService: AppointmentService,
    private readonly userVehicleService: UserVehicleService
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecord>> {
    const { data, ...others } =
      await this.careRecordRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordSelect,
      Prisma.CareRecordWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecord>> {
    const { data, ...others } =
      await this.careRecordRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async findOneById(id: string): Promise<CareRecord> {
    return this.findOneByIdOrFail(id);
  }

  async findOne(
    where: Prisma.CareRecordWhereInput
  ): Promise<CareRecord | null> {
    return this.careRecordRepository.findOne(where);
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
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecord> {
    const created = await this.careRecordRepository.create({
      appointmentId: appointment,
      userVehicleId: userVehicle,
      vehicleModelName,
      technicianId: technician,
      storeId: store,
      confirmedByOwner: confirmedByOwner ? confirmedByOwner : false,
      status: EnumCareRecordStatus.pending,
      paymentStatus: EnumPaymentStatus.unpaid,
    });

    return created;
  }

  /**
   * Create care record with full validation and auto-creation of services
   * Validates appointment and userVehicle existence, then creates care record
   * and auto-creates care-record-services from appointment
   */
  async createWithAppointment(
    body: CareRecordCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<CareRecord> {
    const checkAppointment = await this.appointmentService.findOneById(
      body.appointment
    );
    const checkUserVehicle = await this.userVehicleService.findOneById(
      body.userVehicle
    );

    if (!checkAppointment) {
      throw new NotFoundException({
        statusCode: EnumAppointmentStatusCodeError.notFound,
        message: 'appointment.error.notFound',
      });
    }
    if (!checkUserVehicle) {
      throw new NotFoundException({
        statusCode: EnumUserVehicleStatusCodeError.notFound,
        message: 'user-vehicle.error.notFound',
      });
    }

    // Create care record
    const result = await this.create(body, requestLog, actionBy);

    // Auto create care-record-services from appointment
    await this.createCareRecordServices(
      checkAppointment,
      result.id,
      requestLog,
      actionBy
    );

    return result;
  }

  async update(
    id: string,
    { confirmedByOwner }: CareRecordUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    const careRecord = await this.findOneByIdOrFail(id);

    await this.careRecordRepository.update(id, {
      confirmedByOwner: confirmedByOwner ?? careRecord.confirmedByOwner,
    });
  }

  async updateStatus(
    id: string,
    { status }: CareRecordUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    await this.careRecordRepository.update(id, {
      status,
    });
  }

  async updatePaymentStatus(
    id: string,
    { paymentStatus }: CareRecordUpdatePaymentStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    await this.careRecordRepository.update(id, {
      paymentStatus,
    });
  }

  async updateTechnician(
    id: string,
    { technician }: CareRecordUpdateTechnicianRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);

    await this.careRecordRepository.update(id, {
      technicianId: technician,
    });
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordRepository.delete(id);
  }

  async createCareRecordServices(
    appointment: any,
    careRecordId: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    const allServiceDtos: CareRecordServiceCreateRequestDto[] = [];

    if (
      appointment.customerRequests &&
      appointment.customerRequests.length > 0
    ) {
      const customerRequestDtos = appointment.customerRequests.map(
        (request: string) => ({
          careRecord: careRecordId,
          name: request,
          type: EnumCareRecordServiceType.customerRequest,
        })
      );

      allServiceDtos.push(...customerRequestDtos);
    }

    if (appointment.vehicleServices && appointment.vehicleServices.length > 0) {
      const vehicleServices = await Promise.all(
        appointment.vehicleServices.map((id: string) =>
          this.vehicleServiceService.findOneById(id)
        )
      );

      const vehicleServiceDtos = vehicleServices
        .filter(service => service !== null || service !== undefined)
        .map(service => ({
          careRecord: careRecordId,
          name: service.name,
          vehicleService: service.id,
          type: EnumCareRecordServiceType.service,
        }));

      allServiceDtos.push(...vehicleServiceDtos);
    }

    if (allServiceDtos.length > 0) {
      await this.careRecordServiceService.createMany(allServiceDtos);

      await this.createCareRecordChecklists(
        appointment,
        careRecordId,
        requestLog,
        actionBy
      );
    }
  }

  async createCareRecordChecklists(
    appointment: any,
    careRecordId: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    const allChecklistDtos: CareRecordChecklistCreateRequestDto[] = [];

    const { data: careRecordServices } =
      await this.careRecordServiceService.getListOffset({
        limit: 100,
        skip: 0,
        where: { careRecordId },
      });

    for (const careRecordService of careRecordServices) {
      if (
        careRecordService.type === EnumCareRecordServiceType.service &&
        careRecordService.vehicleServiceId
      ) {
        const vehicleService = await this.vehicleServiceService.findOneById(
          careRecordService.vehicleServiceId
        );

        if (vehicleService) {
          if (
            vehicleService.checklistItems &&
            vehicleService.checklistItems.length > 0
          ) {
            const serviceChecklistDtos = vehicleService.checklistItems.map(
              (serviceChecklist: any) => ({
                careRecordService: careRecordService.id,
                serviceChecklist: serviceChecklist.id || serviceChecklist,
                name: serviceChecklist.name || `${careRecordService.name}`,
                wearPercentage: 100,
              })
            );
            allChecklistDtos.push(...serviceChecklistDtos);
          } else {
            const vehicleServiceChecklistDto: CareRecordChecklistCreateRequestDto =
              {
                careRecordService: careRecordService.id,
                name: vehicleService.name,
                wearPercentage: 100,
              };
            allChecklistDtos.push(vehicleServiceChecklistDto);
          }
        }
      } else if (
        careRecordService.type ===
        EnumCareRecordServiceType.customerRequest
      ) {
        const customerRequestChecklistDto: CareRecordChecklistCreateRequestDto =
          {
            careRecordService: careRecordService.id,
            name: careRecordService.name,
            wearPercentage: 100,
          };
        allChecklistDtos.push(customerRequestChecklistDto);
      }
    }

    if (allChecklistDtos.length > 0) {
      await this.careRecordChecklistService.createMany(
        allChecklistDtos,
        requestLog,
        actionBy
      );
    }
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecord> {
    const careRecord = await this.careRecordRepository.findOneById(id);
    if (!careRecord) {
      throw new NotFoundException({
        statusCode: EnumCareRecordStatusCodeError.notFound,
        message: 'care-record.error.notFound',
      });
    }
    return careRecord;
  }
}
