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
import { HiringDoc, HiringEntity } from '../entities/hiring.entity';
import { HiringCreateRequestDto } from '../dtos/request/hiring.create.request.dto';
import { HiringUpdateRequestDto } from '../dtos/request/hiring.update.request.dto';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';

export interface IHiringService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<HiringDoc[]>;

  findAllActive(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<HiringDoc[]>;

  findOneById(
    _id: string,
    options?: IDatabaseOptions,
  ): Promise<HiringDoc | null>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<HiringDoc | null>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: HiringCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<HiringDoc>;

  update(
    repository: HiringDoc,
    payload: HiringUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<HiringDoc>;

  softDelete(
    repository: HiringDoc,
    options?: IDatabaseSaveOptions,
  ): Promise<HiringDoc>;

  deleteMany(
    find: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByTitle(
    title: string,
    options?: IDatabaseExistsOptions,
  ): Promise<boolean>;

  existBySlug(slug: string, options?: IDatabaseExistsOptions): Promise<boolean>;

  findBySlug(slug: string): Promise<HiringDoc | null>;
}
