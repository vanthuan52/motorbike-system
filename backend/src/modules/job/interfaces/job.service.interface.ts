import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IJobListFilters } from './job.filter.interface';
import { JobCreateRequestDto } from '../dtos/request/job.create.request.dto';
import { JobUpdateRequestDto } from '../dtos/request/job.update.request.dto';
import { JobUpdateStatusRequestDto } from '../dtos/request/job.update-status.request.dto';
import { JobModel } from '../models/job.model';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IJobService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >,
    filters?: IJobListFilters
  ): Promise<IPaginationOffsetReturn<JobModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >,
    filters?: IJobListFilters
  ): Promise<IPaginationCursorReturn<JobModel>>;

  findOne(find: Record<string, any>): Promise<JobModel>;

  findOneById(jobId: string): Promise<JobModel>;

  findOneBySlug(slug: string): Promise<JobModel>;

  create(
    payload: JobCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<DatabaseIdDto>;

  update(
    jobId: string,
    payload: JobUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  updateStatus(
    jobId: string,
    payload: JobUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void>;

  existBySlug(slug: string): Promise<boolean>;

  delete(
    jobId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;

  // === Trash/Restore ===

  getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >
  ): Promise<IPaginationOffsetReturn<JobModel>>;

  restore(
    jobId: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<void>;

  forceDelete(
    jobId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void>;
}
