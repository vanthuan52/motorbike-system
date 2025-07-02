import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseGetTotalOptions,
  IDatabaseOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';

import { PartTypeDoc, PartTypeEntity } from '../entities/part-type.entity';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';

export interface IPartTypeService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartTypeDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PartTypeDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<PartTypeDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartTypeDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: PartTypeCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<PartTypeDoc>;

  update(
    repository: PartTypeDoc,
    payload: PartTypeUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<PartTypeDoc>;

  softDelete(
    repository: PartTypeDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<PartTypeDoc>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  createSlug(name: string): string;

  mapList(data: PartTypeDoc[]): PartTypeListResponseDto[];
  mapGet(data: PartTypeDoc): PartTypeGetResponseDto;
}
