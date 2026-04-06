import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServiceChecklistRepository } from '../repository/service-checklist.repository';
import { IServiceChecklistService } from '../interfaces/service-checklist.service.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumServiceChecklistStatusCodeError } from '../enums/service-checklist.status-code.enum';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { ServiceChecklistModel } from '../models/service-checklist.model';
import { Prisma } from '@/generated/prisma-client';
import { IServiceChecklistListFilters } from '../interfaces/service-checklist.filter.interface';

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
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>> {
    const { data, ...others } =
      await this.serviceChecklistRepository.findWithPaginationOffset(
        pagination,
        filters
      );
    return { data, ...others };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationCursorReturn<ServiceChecklistModel>> {
    const { data, ...others } =
      await this.serviceChecklistRepository.findWithPaginationCursor(
        pagination
      );
    return { data, ...others };
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
    return this.serviceChecklistRepository.findOne(find);
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
  ): Promise<ServiceChecklistModel> {
    const data: Prisma.ServiceChecklistCreateInput = {
      name,
      code,
      description: description ?? null,
      orderBy: orderBy ?? 0,
      vehicleType: [],
      careArea: { connect: { id: careArea } },
      createdBy,
    };

    return this.serviceChecklistRepository.create(data);
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
  ): Promise<ServiceChecklistModel> {
    await this.findOneById(id);

    const data: Prisma.ServiceChecklistUpdateInput = {
      name: name ?? undefined,
      code: code ?? undefined,
      description: description ?? undefined,
      orderBy: orderBy ?? undefined,
      careArea: careArea ? { connect: { id: careArea } } : undefined,
      updatedBy,
    };

    return this.serviceChecklistRepository.update(id, data);
  }

  async delete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceChecklistModel> {
    await this.findOneById(id);
    return this.serviceChecklistRepository.softDelete(id, deletedBy);
  }

  // === Trash/Restore ===

  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ServiceChecklistSelect,
      Prisma.ServiceChecklistWhereInput
    >,
    filters?: IServiceChecklistListFilters
  ): Promise<IPaginationOffsetReturn<ServiceChecklistModel>> {
    const { data, ...others } =
      await this.serviceChecklistRepository.findWithPaginationOffsetTrashed(
        pagination,
        filters
      );
    return { data, ...others };
  }

  async restore(
    id: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<ServiceChecklistModel> {
    const checklist =
      await this.serviceChecklistRepository.findOneByIdIncludeDeleted(id);
    if (!checklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }
    if (!checklist.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumServiceChecklistStatusCodeError.notInTrash,
        message: 'service-checklist.error.notInTrash',
      });
    }
    return this.serviceChecklistRepository.restore(id, restoredBy);
  }

  async forceDelete(
    id: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<ServiceChecklistModel> {
    const checklist =
      await this.serviceChecklistRepository.findOneByIdIncludeDeleted(id);
    if (!checklist) {
      throw new NotFoundException({
        statusCode: EnumServiceChecklistStatusCodeError.notFound,
        message: 'service-checklist.error.notFound',
      });
    }
    if (!checklist.deletedAt) {
      throw new BadRequestException({
        statusCode: EnumServiceChecklistStatusCodeError.notInTrash,
        message: 'service-checklist.error.notInTrash',
      });
    }
    return this.serviceChecklistRepository.forceDelete(id);
  }

  // === Migration helpers ===

  /**
   * Bulk-create service checklists for migration seeds.
   * Does not require requestLog or createdBy.
   */
  async createMany(data: ServiceChecklistCreateRequestDto[]): Promise<number> {
    const createData = data.map(item => ({
      name: item.name,
      code: item.code,
      description: item.description ?? null,
      orderBy: item.orderBy ?? 0,
      vehicleType: item.vehicleType || [],
      careAreaId: item.careArea,
    }));

    return this.serviceChecklistRepository.createMany(createData);
  }

  /**
   * Hard-delete all service checklist records.
   * Intended for use in migration seeds only.
   */
  async deleteMany(): Promise<void> {
    await this.serviceChecklistRepository.deleteMany({});
  }
}
