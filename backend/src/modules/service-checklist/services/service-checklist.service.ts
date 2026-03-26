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
import { ServiceChecklist, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ServiceChecklistService implements IServiceChecklistService {
  constructor(
    private readonly serviceChecklistRepository: ServiceChecklistRepository
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
  ): Promise<IPaginationOffsetReturn<ServiceChecklist>> {
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
  ): Promise<IPaginationCursorReturn<ServiceChecklist>> {
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

  async findOneById(id: string): Promise<ServiceChecklist> {
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

  async findOne(find: Record<string, any>): Promise<ServiceChecklist | null> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOne(find);
    return serviceChecklist;
  }

  async create({
    name,
    code,
    description,
    orderBy,
    careArea,
  }: ServiceChecklistCreateRequestDto): Promise<{ id: string }> {
    const data: Prisma.ServiceChecklistCreateInput = {
      name,
      code,
      description: description ?? null,
      orderBy: orderBy ?? '0',
      vehicleType: [],
      careArea: { connect: { id: careArea } },
    };

    const created = await this.serviceChecklistRepository.create(data);

    return { id: created.id };
  }

  async update(
    id: string,
    {
      name,
      description,
      code,
      orderBy,
      careArea,
    }: ServiceChecklistUpdateRequestDto
  ): Promise<void> {
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
    };

    await this.serviceChecklistRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOneById(id);
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }

    await this.serviceChecklistRepository.delete(id);
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
