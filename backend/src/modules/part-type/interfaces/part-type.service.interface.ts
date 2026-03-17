import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSoftDeleteOptions,
  IDatabaseUpdateOptions,
} from '@/common/database/interfaces/database.interface';
import { PartTypeCreateRequestDto } from '../dtos/request/part-type.create.request.dto';
import { PartTypeUpdateRequestDto } from '../dtos/request/part-type.update.request.dto';
import { PartTypeUpdateStatusRequestDto } from '../dtos/request/part-type.update-status.request.dto';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { PartTypeDoc } from '../entities/part-type.entity';

export interface IPartTypeService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: PartTypeDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    status?: Record<string, IPaginationIn>,
  ): Promise<{ data: PartTypeDoc[]; total?: number }>;

  findOneById(
    partTypeId: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<PartTypeDoc>;

  findOneBySlug(slug: string): Promise<PartTypeDoc>;

  create(
    payload: PartTypeCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  update(
    partTypeId: string,
    payload: PartTypeUpdateRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  updateStatus(
    partTypeId: string,
    payload: PartTypeUpdateStatusRequestDto,
    options?: IDatabaseUpdateOptions,
  ): Promise<void>;

  delete(partTypeId: string, options?: IDatabaseUpdateOptions): Promise<void>;

  softDelete(
    partTypeId: string,
    options?: IDatabaseSoftDeleteOptions,
  ): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
