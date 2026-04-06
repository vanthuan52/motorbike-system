import { Injectable, NotFoundException } from '@nestjs/common';
import { ICareRecordServiceService } from '../interfaces/care-record-service.service.interface';
import { CareRecordServiceRepository } from '../repository/care-record-service.repository';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { EnumCareRecordServiceStatus } from '../enums/care-record-service.enum';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordChecklistService } from '@/modules/care-record-checklist/services/care-record-checklist.service';
import { CareRecordServiceUtil } from '../utils/care-record-service.util';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { EnumCareRecordServiceStatusCodeError } from '../enums/care-record-service.status-code.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { CareRecordServiceModel } from '../models/care-record-service.model';
import { ICareRecordServiceListFilters } from '../interfaces/care-record-service.filter.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class CareRecordServiceService implements ICareRecordServiceService {
  constructor(
    private readonly careRecordServiceRepository: CareRecordServiceRepository,
    private readonly careRecordChecklistService: CareRecordChecklistService,
    private readonly careRecordServiceUtil: CareRecordServiceUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: ICareRecordServiceListFilters
  ): Promise<IPaginationOffsetReturn<CareRecordServiceModel>> {
    const { data, ...others } =
      await this.careRecordServiceRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: ICareRecordServiceListFilters
  ): Promise<IPaginationCursorReturn<CareRecordServiceModel>> {
    const { data, ...others } =
      await this.careRecordServiceRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    return { data, ...others };
  }

  async getListOffsetWithChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: ICareRecordServiceListFilters
  ): Promise<
    IPaginationOffsetReturn<{
      service: CareRecordServiceModel;
      checklists: any[];
    }>
  > {
    const { data: careRecordServices, ...others } =
      await this.careRecordServiceRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const result: {
      service: CareRecordServiceModel;
      checklists: any[];
    }[] = [];

    for (const careRecordService of careRecordServices) {
      const checklistFind: Record<string, any> = {
        careRecordServiceId: careRecordService.id,
      };

      const checklistResponse =
        await this.careRecordChecklistService.getListOffset({
          limit: 100,
          skip: 0,
          where: checklistFind,
          orderBy: [
            { createdAt: EnumPaginationOrderDirectionType.desc } as any,
          ],
        });

      result.push({
        service: careRecordService,
        checklists: checklistResponse.data,
      });
    }

    return {
      data: result,
      ...others,
    };
  }

  async findOneById(id: string): Promise<CareRecordServiceModel> {
    return this.findOneByIdOrFail(id);
  }

  async findOneWithRelationsById(id: string): Promise<CareRecordServiceModel> {
    const careRecordService = await this.findOneByIdOrFail(id);
    return careRecordService;
  }

  async create(
    {
      careRecord,
      name,
      vehicleService,
      type,
    }: CareRecordServiceCreateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<DatabaseIdDto> {
    const created = await this.careRecordServiceRepository.create({
      careRecord: { connect: { id: careRecord } },
      name,
      vehicleService: vehicleService
        ? { connect: { id: vehicleService } }
        : undefined,
      type,
      status: EnumCareRecordServiceStatus.pending,
      createdBy: actionBy,
    });

    return { id: created.id } as any;
  }

  async createMany(
    dtos: CareRecordServiceCreateRequestDto[],
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<boolean> {
    const data = dtos.map(dto => ({
      careRecord: { connect: { id: dto.careRecord } },
      name: dto.name,
      vehicleService: dto.vehicleService
        ? { connect: { id: dto.vehicleService } }
        : undefined,
      type: dto.type,
      status: EnumCareRecordServiceStatus.pending,
      createdBy: actionBy,
    }));

    await this.careRecordServiceRepository.createMany(data as any);

    return true;
  }

  async update(
    id: string,
    payload: CareRecordServiceUpdateRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.update(id, {
      updatedBy: actionBy,
    });
    return;
  }

  async updateStatus(
    id: string,
    { status }: CareRecordServiceUpdateStatusRequestDto,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.update(id, {
      status,
      updatedBy: actionBy,
    });
    return;
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.softDelete(id, actionBy);
    return;
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.careRecordServiceRepository.restore(id, actionBy);
    return;
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    actionBy: string
  ): Promise<void> {
    await this.careRecordServiceRepository.forceDelete(id);
    return;
  }

  async deleteMany(find?: Record<string, any>): Promise<boolean> {
    return true; // Skipping complex bulk deletes unless implemented in repo
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordServiceModel> {
    const careRecordService =
      await this.careRecordServiceRepository.findOneById(id);
    if (!careRecordService) {
      throw new NotFoundException({
        statusCode: EnumCareRecordServiceStatusCodeError.notFound,
        message: 'care-record-service.error.notFound',
      });
    }
    return careRecordService;
  }
}
