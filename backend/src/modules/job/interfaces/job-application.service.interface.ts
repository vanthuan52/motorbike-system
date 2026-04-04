import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { JobApplicationUserCreateRequestDto } from '../dtos/request/job-application.create.request.dto';
import { JobApplicationUpdateStatusRequestDto } from '../dtos/request/job-application.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { JobApplicationModel } from '../models/job-application.model';
import { IJobApplicationListFilters } from './job-application.filter.interface';
import { Prisma } from '@/generated/prisma-client';

export interface IJobApplicationService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationOffsetReturn<JobApplicationModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationCursorReturn<JobApplicationModel>>;

  findOneById(id: string): Promise<JobApplicationModel | null>;

  findOne(
    where: Prisma.JobApplicationWhereInput
  ): Promise<JobApplicationModel | null>;

  create(payload: JobApplicationUserCreateRequestDto): Promise<DatabaseIdDto>;

  updateStatus(
    id: string,
    payload: JobApplicationUpdateStatusRequestDto
  ): Promise<void>;

  delete(id: string): Promise<void>;
}
