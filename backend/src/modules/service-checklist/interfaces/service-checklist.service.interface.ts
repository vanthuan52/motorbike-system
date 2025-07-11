import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { ServiceChecklistDoc } from '../entities/service-checklist.entity';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';

export interface IServiceChecklistService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<ServiceChecklistDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<ServiceChecklistDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: ServiceChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<ServiceChecklistDoc>;

  createMany(
    data: ServiceChecklistCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;

  update(
    repository: ServiceChecklistDoc,
    payload: ServiceChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc>;

  softDelete(
    repository: ServiceChecklistDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<ServiceChecklistDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  mapList(data: ServiceChecklistDoc[]): ServiceChecklistListResponseDto[];
  mapGet(data: ServiceChecklistDoc): ServiceChecklistGetResponseDto;
}
