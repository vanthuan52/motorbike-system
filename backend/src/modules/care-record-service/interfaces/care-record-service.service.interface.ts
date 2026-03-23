import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordService } from '@prisma/client';

export interface ICareRecordServiceService {
  getListOffset(
    { where, ...params }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordService[]; total: number }>;

  getListCursor(
    { where, ...params }: IPaginationQueryCursorParams,
    filters?: Record<string, any>
  ): Promise<{ data: CareRecordService[]; total?: number }>;

  getListOffsetWithChecklists(
    { where, ...params }: IPaginationQueryOffsetParams,
    filters?: Record<string, any>
  ): Promise<{
    data: {
      service: CareRecordService;
      checklists: any[];
    }[];
    total: number;
  }>;

  findOneById(id: string): Promise<CareRecordService>;

  create(payload: CareRecordServiceCreateRequestDto): Promise<{ _id: string }>;

  update(id: string, payload: CareRecordServiceUpdateRequestDto): Promise<void>;

  updateStatus(
    id: string,
    payload: CareRecordServiceUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;

  createMany(dtos: CareRecordServiceCreateRequestDto[]): Promise<boolean>;

  deleteMany(find?: Record<string, any>): Promise<boolean>;
}
