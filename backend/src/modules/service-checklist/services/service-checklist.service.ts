import { Injectable } from '@nestjs/common';
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
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ENUM_SERVICE_CHECKLIST_AREA } from '../enums/service-checklist.enum';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { IServiceChecklistEntity } from '../interfaces/service-checklist.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServiceChecklistService implements IServiceChecklistService {
  constructor(
    private readonly serviceChecklistRepository: ServiceChecklistRepository,
  ) {}
  async existByName(
    name: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean> {
    const ServiceChecklist = await this.serviceChecklistRepository.findOne(
      { name },
      options,
    );
    return !!ServiceChecklist;
  }

  mapList(
    ServiceChecklist: ServiceChecklistDoc[] | IServiceChecklistEntity[],
  ): ServiceChecklistListResponseDto[] {
    return plainToInstance(
      ServiceChecklistListResponseDto,
      ServiceChecklist.map(
        (p: ServiceChecklistDoc | IServiceChecklistEntity) =>
          typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    ServiceChecklist: ServiceChecklistDoc | IServiceChecklistEntity,
  ): ServiceChecklistGetResponseDto {
    return plainToInstance(
      ServiceChecklistGetResponseDto,
      typeof (ServiceChecklist as any).toObject === 'function'
        ? (ServiceChecklist as any).toObject()
        : ServiceChecklist,
    );
  }

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceChecklistDoc[]> {
    return this.serviceChecklistRepository.findAll<ServiceChecklistDoc>(
      find,
      options,
    );
  }

  async findOneById(
    _id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc | null> {
    return this.serviceChecklistRepository.findOneById<ServiceChecklistDoc>(
      _id,
      options,
    );
  }
  async join(repository: ServiceChecklistDoc): Promise<ServiceChecklistDoc> {
    return this.serviceChecklistRepository.join(
      repository,
      this.serviceChecklistRepository._join!,
    );
  }
  async findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc | null> {
    return this.serviceChecklistRepository.findOne<ServiceChecklistDoc>(
      find,
      options,
    );
  }

  async getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.serviceChecklistRepository.getTotal(find, options);
  }

  async create(
    { name, code, description, order, area }: ServiceChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceChecklistDoc> {
    const create: ServiceChecklistEntity = new ServiceChecklistEntity();
    create.name = name;
    create.code = code;
    create.description = description;
    create.order = order;
    create.area = area as ENUM_SERVICE_CHECKLIST_AREA;

    return this.serviceChecklistRepository.create<ServiceChecklistEntity>(
      create,
      options,
    );
  }

  async update(
    repository: ServiceChecklistDoc,
    { name, description, code, order, area }: ServiceChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc> {
    repository.name = name ?? repository.name;
    repository.code = code ?? repository.code;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    repository.area = (area as ENUM_SERVICE_CHECKLIST_AREA) ?? repository.area;
    return this.serviceChecklistRepository.save(repository, options);
  }

  async softDelete(
    repository: ServiceChecklistDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc> {
    return this.serviceChecklistRepository.softDelete(repository, options);
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
    const create: ServiceChecklistEntity[] = data.map(
      ({ name, description, code, order, area }) => {
        const entity: ServiceChecklistEntity = new ServiceChecklistEntity();
        entity.name = name;
        entity.code = code;
        entity.description = description;
        entity.order = order;
        entity.area = area as ENUM_SERVICE_CHECKLIST_AREA;

        return entity;
      },
    ) as ServiceChecklistEntity[];

    await this.serviceChecklistRepository.createMany<ServiceChecklistEntity>(
      create,
      options,
    );

    return true;
  }
}
