import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceChecklistRepository } from '../repository/service-checklist.repository';
import { IServiceChecklistService } from '../interfaces/service-checklist.service.interface';
import {
  ServiceChecklistDoc,
  ServiceChecklistEntity,
} from '../entities/service-checklist.entity';
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistUtil } from '../utils/service-checklist.util';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR } from '../enums/service-checklist.status-code.enum';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

@Injectable()
export class ServiceChecklistService implements IServiceChecklistService {
  constructor(
    private readonly serviceChecklistRepository: ServiceChecklistRepository,
  ) {}

  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const serviceChecklist = await this.serviceChecklistRepository.findOne(
      { name },
      options,
    );
    return !!serviceChecklist;
  }

  async getListOffset(
    { limit, skip, where, orderBy }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceChecklistDoc[]; total: number }> {
    const find: Record<string, any> = {
      ...where,
      ...filters,
    };

    const [serviceChecklists, total] = await Promise.all([
      this.serviceChecklistRepository.findAll<ServiceChecklistDoc>(find, {
        paging: { limit, offset: skip },
        order: orderBy,
      }),
      this.serviceChecklistRepository.getTotal(find),
    ]);

    return {
      data: serviceChecklists,
      total,
    };
  }

  async findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc> {
    const serviceChecklist = await this.findOneByIdOrFail(id, options);
    return serviceChecklist;
  }

  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOne<ServiceChecklistDoc>(
        find,
        options,
      );
    return serviceChecklist;
  }

  async create(
    {
      name,
      code,
      description,
      order,
      careArea,
    }: ServiceChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto> {
    const create: ServiceChecklistEntity = new ServiceChecklistEntity();
    create.name = name;
    create.code = code;
    create.description = description;
    create.order = order;
    create.careArea = careArea;

    const created =
      await this.serviceChecklistRepository.create<ServiceChecklistEntity>(
        create,
        options,
      );

    return { _id: created._id };
  }

  async update(
    id: string,
    {
      name,
      description,
      code,
      order,
      careArea,
    }: ServiceChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    repository.name = name ?? repository.name;
    repository.code = code ?? repository.code;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    repository.careArea = careArea ?? repository.careArea;

    await this.serviceChecklistRepository.save(repository, options);
  }

  async delete(id: string, options?: IDatabaseSaveOptions): Promise<void> {
    const repository = await this.findOneByIdOrFail(id);
    await this.serviceChecklistRepository.softDelete(repository, options);
  }

  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    await this.serviceChecklistRepository.deleteMany(find, options);
    return true;
  }

  async createMany(
    data: ServiceChecklistCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean> {
    const create = data.map((item) => {
      const doc: any = {
        name: item.name,
        code: item.code,
        description: item.description,
        order: item.order,
        careArea: item.careArea,
        vehicleType: item.vehicleType || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        __v: 0,
      };
      return doc;
    });

    await this.serviceChecklistRepository['_repository'].insertMany(create, {
      ordered: false,
    });

    return true;
  }

  private async findOneByIdOrFail(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc> {
    const serviceChecklist =
      await this.serviceChecklistRepository.findOneById<ServiceChecklistDoc>(
        id,
        options,
      );
    if (!serviceChecklist) {
      throw new NotFoundException({
        statusCode: ENUM_SERVICE_CHECKLIST_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'service-checklist.error.notFound',
      });
    }
    return serviceChecklist;
  }
}
