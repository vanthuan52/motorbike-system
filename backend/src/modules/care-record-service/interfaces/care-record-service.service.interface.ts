import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CareRecordService, Prisma } from '@generated/prisma-client';

export interface ICareRecordServiceService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationOffsetReturn<CareRecordService>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<IPaginationCursorReturn<CareRecordService>>;

  getListOffsetWithChecklists(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CareRecordServiceSelect,
      Prisma.CareRecordServiceWhereInput
    >,
    filters?: Record<string, any>
  ): Promise<
    IPaginationOffsetReturn<{
      service: CareRecordService;
      checklists: any[];
    }>
  >;

  findOneById(id: string): Promise<CareRecordService>;

  create(payload: CareRecordServiceCreateRequestDto): Promise<DatabaseIdDto>;

  update(id: string, payload: CareRecordServiceUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordServiceUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  createMany(dtos: CareRecordServiceCreateRequestDto[]): Promise<boolean>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
