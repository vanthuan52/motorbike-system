import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import { PartDto } from '../dtos/part.dto';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { PartDoc } from '../entities/part.entity';

export interface IPartService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: PartDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
    partTypeId?: string,
    vehicleBrandId?: string,
  ): Promise<{ data: PartDoc[]; total?: number }>;

  findOneById(
    partId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc>;

  findOneWithRelationsById(
    partId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc>;

  findOneBySlug(
    slug: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartDoc>;

  create(
    payload: PartCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    partId: string,
    payload: PartUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateStatus(
    partId: string,
    payload: PartUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  existBySlug(
    slug: string,
    options?: IDatabaseExistsOptions,
  ): Promise<{ exist: boolean }>;

  delete(partId: string, options?: IDatabaseUpdateOptions): Promise<void>;

  softDelete(
    partId: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
