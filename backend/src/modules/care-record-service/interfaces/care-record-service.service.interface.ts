import {
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
  IDatabaseFindOneOptions,
  IDatabaseSaveOptions,
} from '@/common/database/interfaces/database.interface';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordServiceDoc } from '../entities/care-record-service.entity';
import { CareRecordChecklistDoc } from '@/modules/care-record-checklist/entities/care-record-checklist.entity';

export interface ICareRecordServiceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{ data: CareRecordServiceDoc[]; total: number }>;

  getListOffsetWithChecklists(
    pagination: IPaginationQueryOffsetParams,
    filters?: Record<string, any>,
  ): Promise<{
    data: {
      service: CareRecordServiceDoc;
      checklists: CareRecordChecklistDoc[];
    }[];
    total: number;
  }>;

  findOneById(
    id: string,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc>;

  findOne(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<CareRecordServiceDoc>;

  create(
    payload: CareRecordServiceCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CareRecordServiceDoc>;

  update(
    id: string,
    payload: CareRecordServiceUpdateRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordServiceUpdateStatusRequestDto,
    options?: IDatabaseSaveOptions,
  ): Promise<void>;

  delete(id: string, options?: IDatabaseSaveOptions): Promise<void>;

  createMany(
    dtos: CareRecordServiceCreateRequestDto[],
    options?: IDatabaseCreateOptions,
  ): Promise<boolean>;

  deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean>;
}
