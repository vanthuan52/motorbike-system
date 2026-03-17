import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseExistsOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { CareAreaDoc } from '../entities/care-area.entity';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { ENUM_VEHICLE_MODEL_TYPE } from '@/modules/vehicle-model/enums/vehicle-model.enum';

export interface ICareAreaService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareAreaDoc[]; total: number }>;

  getListCursor(
    pagination: IPaginationQueryCursorParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareAreaDoc[]; total?: number }>;

  getListOffsetWithServiceChecklists(
    pagination: IPaginationQueryOffsetParams,
    vehicleType?: ENUM_VEHICLE_MODEL_TYPE,
  ): Promise<{
    data: CareAreaDoc[];
    total: number;
    checklistMap: Map<string, any[]>;
  }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareAreaDoc>;

  create(
    payload: CareAreaCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<DatabaseIdDto>;

  createMany(
    data: CareAreaCreateRequestDto[],
    options?: IDatabaseCreateManyOptions,
  ): Promise<boolean>;

  update(
    id: string,
    payload: CareAreaUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  softDelete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;

  existByName(name: string, options?: IDatabaseExistsOptions): Promise<boolean>;
}
