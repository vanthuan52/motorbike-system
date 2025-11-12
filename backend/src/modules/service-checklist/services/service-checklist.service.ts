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
  IDatabaseDeleteOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
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
    const serviceChecklist = await this.serviceChecklistRepository.findOne(
      { name },
      options,
    );
    return !!serviceChecklist;
  }

  mapList(
    serviceChecklist: ServiceChecklistDoc[] | IServiceChecklistEntity[],
  ): ServiceChecklistListResponseDto[] {
    return plainToInstance(
      ServiceChecklistListResponseDto,
      serviceChecklist.map(
        (p: ServiceChecklistDoc | IServiceChecklistEntity) =>
          typeof (p as any).toObject === 'function' ? (p as any).toObject() : p,
      ),
    );
  }

  mapGet(
    serviceChecklist: ServiceChecklistDoc | IServiceChecklistEntity,
  ): ServiceChecklistGetResponseDto {
    return plainToInstance(
      ServiceChecklistGetResponseDto,
      typeof (serviceChecklist as any).toObject === 'function'
        ? (serviceChecklist as any).toObject()
        : serviceChecklist,
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
    {
      name,
      code,
      description,
      order,
      careArea,
    }: ServiceChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceChecklistDoc> {
    const create: ServiceChecklistEntity = new ServiceChecklistEntity();
    create.name = name;
    create.code = code;
    create.description = description;
    create.order = order;
    create.careArea = careArea;

    return this.serviceChecklistRepository.create<ServiceChecklistEntity>(
      create,
      options,
    );
  }

  async update(
    repository: ServiceChecklistDoc,
    {
      name,
      description,
      code,
      order,
      careArea,
    }: ServiceChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc> {
    repository.name = name ?? repository.name;
    repository.code = code ?? repository.code;
    repository.description = description ?? repository.description;
    repository.order = order ?? repository.order;
    repository.careArea = careArea ?? repository.careArea;
    return this.serviceChecklistRepository.save(repository, options);
  }

  async softDelete(
    repository: ServiceChecklistDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc> {
    return this.serviceChecklistRepository.softDelete(repository, options);
  }

  async delete(
    repository: ServiceChecklistDoc,
    options?: IDatabaseDeleteOptions,
  ): Promise<ServiceChecklistDoc> {
    return this.serviceChecklistRepository.delete(
      { _id: repository._id },
      options,
    );
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

    // Use insertMany directly to ensure vehicleType is preserved
    await this.serviceChecklistRepository['_repository'].insertMany(create, {
      ordered: false,
    });

    return true;
  }
}
