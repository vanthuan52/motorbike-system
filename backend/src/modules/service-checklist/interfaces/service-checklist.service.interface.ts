import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ServiceChecklistCreateRequestDto } from '../dtos/request/service-checklist.create.request.dto';
import { ServiceChecklistUpdateRequestDto } from '../dtos/request/service-checklist.update.request.dto';
import { ServiceChecklistDoc } from '../entities/service-checklist.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export interface IServiceChecklistService {
  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: ServiceChecklistDoc[]; total: number }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<ServiceChecklistDoc>;

  create(
    payload: ServiceChecklistCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  createMany(
    data: ServiceChecklistCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;

  update(
    id: string,
    payload: ServiceChecklistUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
