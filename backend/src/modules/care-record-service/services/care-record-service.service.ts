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
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumPaginationOrderDirectionType } from '@/common/pagination/enums/pagination.enum';
import { EnumCareRecordServiceStatusCodeError } from '../enums/care-record-service.status-code.enum';
import { CareRecordService, Prisma } from '@generated/prisma-client';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

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
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordService[]; total: number }> {
    const { data, count } =
      await this.careRecordServiceRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const careRecordServices: CareRecordService[] = data;
    return { data: careRecordServices, total: count || 0 };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordService[]; total?: number }> {
    const { data, count } =
      await this.careRecordServiceRepository.findWithPaginationCursor({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const careRecordServices: CareRecordService[] = data;
    return { data: careRecordServices, total: count || 0 };
  }

  async getListOffsetWithChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<{
    data: {
      service: CareRecordService;
      checklists: any[];
    }[];
    total: number;
  }> {
    const { data: careRecordServices, count: total } =
      await this.careRecordServiceRepository.findWithPaginationOffset({
        ...pagination,
        where: {
          ...pagination.where,
          ...filters,
        },
      });

    const result: {
      service: CareRecordService;
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
          orderBy: { createdAt: EnumPaginationOrderDirectionType.desc },
        });

      result.push({
        service: careRecordService,
        checklists: checklistResponse.data,
      });
    }

    return {
      data: result,
      total,
    };
  }

  async findOneById(id: string): Promise<CareRecordService> {
    return this.findOneByIdOrFail(id);
  }

  async findOneWithRelationsById(id: string): Promise<CareRecordService> {
    const careRecordService = await this.findOneByIdOrFail(id);
    return careRecordService;
  }

  async create({
    careRecord,
    name,
    vehicleService,
    type,
  }: CareRecordServiceCreateRequestDto): Promise<DatabaseIdDto> {
    const created = await this.careRecordServiceRepository.create({
      careRecord: { connect: { id: careRecord } },
      name,
      vehicleService: vehicleService
        ? { connect: { id: vehicleService } }
        : undefined,
      type,
      status: EnumCareRecordServiceStatus.pending,
    });

    return { _id: created.id };
  }

  async createMany(
    dtos: CareRecordServiceCreateRequestDto[]
  ): Promise<boolean> {
    const data = dtos.map(dto => ({
      careRecord: { connect: { id: dto.careRecord } },
      name: dto.name,
      vehicleService: dto.vehicleService
        ? { connect: { id: dto.vehicleService } }
        : undefined,
      type: dto.type,
      status: EnumCareRecordServiceStatus.pending,
    }));

    await this.careRecordServiceRepository.createMany(data as any);

    return true;
  }

  async update(
    id: string,
    payload: CareRecordServiceUpdateRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    // Update fields if needed in future
    return;
  }

  async updateStatus(
    id: string,
    { status }: CareRecordServiceUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.update(id, { status });
    return;
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.careRecordServiceRepository.delete(id);
    return;
  }

  private async findOneByIdOrFail(id: string): Promise<CareRecordService> {
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
