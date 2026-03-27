import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceChecklistRepository } from '../repository/service-checklist.repository';
import { IServiceChecklistService } from '../interfaces/service-checklist.service.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumServiceChecklistStatusCodeError } from '../enums/service-checklist.status-code.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { ServiceChecklistUtil } from '../utils/service-checklist.util';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServiceChecklistService implements IServiceChecklistService {
  constructor(
    private readonly serviceChecklistRepository: ServiceChecklistRepository,
    private readonly serviceChecklistUtil: ServiceChecklistUtil
  ) {}

  async existByName(name: string): Promise<boolean> {
    const serviceChecklist = await this.serviceChecklistRepository.findOne({
      name,
    });
    return !!serviceChecklist;
  }

  async getListOffset(
    {
      limit,
      skip,
      where,
      orderBy,
    }: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>> {
    const mergedWhere: Prisma.ServiceChecklistWhereInput = {
      ...where,
      ...filters,
    };

    return this.serviceChecklistRepository.findWithPaginationOffset({
      limit,
      skip,
      where: mergedWhere,
      orderBy,
    });
  }

  async getListCursor(
    {
      limit,
      where,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    }: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<ServiceChecklistModel>> {
    const mergedWhere: Prisma.ServiceChecklistWhereInput = {
      ...where,
      ...filters,
    };

    return this.serviceChecklistRepository.findWithPaginationCursor({
      limit,
      where: mergedWhere,
      orderBy,
      cursor,
      cursorField,
      includeCount,
    });
  }

  async findOneById(id: string): Promise<ServiceChecklistModel> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOneById(id);
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }
    return serviceChecklist;
  }

  async findOne(
    find: Record<string, any>
  ): Promise<ServiceChecklistModel | null> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOne(find);
    return serviceChecklist;
  }

  async create(
    {
      name,
      code,
      description,
      orderBy,
      careArea,
    }: ServiceChecklistCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<IResponseReturn<{ id: string }>> {
    const data: Prisma.ServiceChecklistCreateInput = {
      name,
      code,
      description: description ?? null,
      orderBy: orderBy ?? '0',
      vehicleType: [],
      careArea: { connect: { id: careArea } },
      createdBy,
    };

    const created = await this.serviceChecklistRepository.create(data);

    return {
      data: { id: created.id },
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(created),
    };
  }

  async update(
    id: string,
    {
      name,
      description,
      code,
      orderBy,
      careArea,
    }: ServiceChecklistUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<IResponseReturn<void>> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOneById(id);
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }

    const data: Prisma.ServiceChecklistUpdateInput = {
      name: name ?? undefined,
      code: code ?? undefined,
      description: description ?? undefined,
      orderBy: orderBy ?? undefined,
      careArea: careArea ? { connect: { id: careArea } } : undefined,
      updatedBy,
    };

    const updated = await this.serviceChecklistRepository.update(id, data);
    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(updated),
    };
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<IResponseReturn<void>> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOneById(id);
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }

    const deleted = await this.serviceChecklistRepository.update(id, {
      deletedAt: new Date(),
      deletedBy,
    } as any);

    return {
      metadataActivityLog:
        this.serviceChecklistUtil.mapActivityLogMetadata(deleted),
    };
  }

  async createMany(data: ServiceChecklistCreateRequestDto[]): Promise<number> {
    const create = data.map(item => ({
      name: item.name,
      code: item.code,
      description: item.description ?? null,
      orderBy: item.orderBy ?? '0',
      vehicleType: item.vehicleType || [],
      careAreaId: item.careArea,
    }));

    const result = await this.serviceChecklistRepository.createMany(
      create as Prisma.ServiceChecklistCreateInput[]
    );

    return result;
  }
}
