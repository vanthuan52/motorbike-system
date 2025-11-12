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

import { CareAreaDoc } from '../entities/care-area.entity';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';

export interface ICareAreaService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CareAreaDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<CareAreaDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CareAreaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareAreaDoc>;

  createMany(
    data: CareAreaCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;

  update(
    repository: CareAreaDoc,
    payload: CareAreaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<CareAreaDoc>;

  softDelete(
    repository: CareAreaDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<CareAreaDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  mapList(data: CareAreaDoc[]): CareAreaListResponseDto[];
  mapGet(data: CareAreaDoc): CareAreaGetResponseDto;
}
