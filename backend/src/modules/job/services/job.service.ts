import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobRepository } from '../repository/job.repository';
import { IJobService } from '../interfaces/job.service.interface';
import { JobCreateRequestDto } from '../dtos/request/job.create.request.dto';
import { JobUpdateRequestDto } from '../dtos/request/job.update.request.dto';
import { JobUpdateStatusRequestDto } from '../dtos/request/job.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { IJobMigrationCreate } from '../interfaces/job.migration.interface';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumJobStatusCodeError } from '../enums/job.status-code.enum';
import { EnumJobStatus } from '../enums/job.enum';
import { JobModel } from '../models/job.model';
import { JobUtil } from '../utils/job.util';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IJobListFilters } from '../interfaces/job.filter.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class JobService implements IJobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobUtil: JobUtil
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >,
    filters?: IJobListFilters
  ): Promise<IPaginationOffsetReturn<JobModel>> {
    const { data, ...others } =
      await this.jobRepository.findWithPaginationOffset(pagination, filters);

    return {
      data,
      ...others,
    };
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >,
    filters?: IJobListFilters
  ): Promise<IPaginationCursorReturn<JobModel>> {
    const { data, ...others } =
      await this.jobRepository.findWithPaginationCursor(pagination, filters);

    return {
      data,
      ...others,
    };
  }

  async findOne(find: Record<string, any>): Promise<JobModel> {
    const job = await this.jobRepository.findOne(find);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    return job;
  }

  async findOneById(jobId: string): Promise<JobModel> {
    const job = await this.jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }
    return job;
  }

  async findOneBySlug(slug: string): Promise<JobModel> {
    const job = await this.jobRepository.findOneBySlug(slug);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }
    return job;
  }

  async create(
    payload: JobCreateRequestDto,
    requestLog: IRequestLog,
    createdBy: string
  ): Promise<DatabaseIdDto> {
    const slug = this.jobUtil.createSlug(payload.title);

    const data: Prisma.JobCreateInput = {
      title: payload.title,
      slug: slug,
      description: payload.description,
      requirements: payload.requirements,
      location: payload.location,
      salaryRange: payload.salaryRange,
      applicationDeadline: new Date(payload.applicationDeadline),
      category: payload.category,
      jobType: payload.jobType,
      status: EnumJobStatus.draft,
    };

    const created = await this.jobRepository.create(data);
    return { id: created.id };
  }

  async update(
    jobId: string,
    payload: JobUpdateRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const job = await this.jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    const data: Prisma.JobUpdateInput = {};
    if (payload.title !== undefined) {
      data.title = payload.title;
    }
    if (payload.slug !== undefined) {
      data.slug = payload.slug;
    }
    if (payload.description !== undefined) {
      data.description = payload.description;
    }
    if (payload.requirements !== undefined) {
      data.requirements = payload.requirements;
    }
    if (payload.location !== undefined) {
      data.location = payload.location;
    }
    if (payload.salaryRange !== undefined) {
      data.salaryRange = payload.salaryRange;
    }
    if (payload.applicationDeadline !== undefined) {
      data.applicationDeadline = new Date(payload.applicationDeadline);
    }
    if (payload.category !== undefined) {
      data.category = payload.category;
    }
    if (payload.jobType !== undefined) {
      data.jobType = payload.jobType;
    }

    if (Object.keys(data).length > 0) {
      await this.jobRepository.update(jobId, data);
    }
  }

  async updateStatus(
    jobId: string,
    { status }: JobUpdateStatusRequestDto,
    requestLog: IRequestLog,
    updatedBy: string
  ): Promise<void> {
    const job = await this.jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    await this.jobRepository.update(jobId, { status });
  }

  async existBySlug(slug: string): Promise<boolean> {
    const job = await this.jobRepository.findOneBySlug(slug);
    return !!job;
  }

  /**
   * Soft delete a job by setting deletedAt timestamp.
   * The record remains in DB but is hidden from normal queries.
   */
  async delete(
    jobId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const job = await this.jobRepository.findOneById(jobId);
    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    await this.jobRepository.softDelete(jobId, deletedBy);
  }

  // === Trash/Restore ===

  /**
   * Get paginated list of soft-deleted (trashed) jobs.
   */
  async getTrashList(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >
  ): Promise<IPaginationOffsetReturn<JobModel>> {
    const { data, ...others } =
      await this.jobRepository.findWithPaginationOffsetTrashed(pagination);

    return {
      data,
      ...others,
    };
  }

  /**
   * Restore a soft-deleted job from trash.
   * Clears deletedAt and deletedBy, making it visible again.
   */
  async restore(
    jobId: string,
    requestLog: IRequestLog,
    restoredBy: string
  ): Promise<void> {
    const job = await this.jobRepository.findOneByIdIncludeDeleted(jobId);

    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    if (!job.deletedAt) {
      throw new ConflictException({
        statusCode: EnumJobStatusCodeError.notInTrash,
        message: 'job.error.notInTrash',
      });
    }

    await this.jobRepository.restore(jobId, restoredBy);
  }

  /**
   * Permanently remove a job from the database.
   * The record must already be in trash (soft-deleted).
   * WARNING: This action is irreversible.
   */
  async forceDelete(
    jobId: string,
    requestLog: IRequestLog,
    deletedBy: string
  ): Promise<void> {
    const job = await this.jobRepository.findOneByIdIncludeDeleted(jobId);

    if (!job) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'job.error.notFound',
      });
    }

    if (!job.deletedAt) {
      throw new ConflictException({
        statusCode: EnumJobStatusCodeError.notInTrash,
        message: 'job.error.notInTrash',
      });
    }

    await this.jobRepository.forceDelete(jobId);
  }

  // === Migration helpers ===

  /**
   * Create a job record for migration seeds.
   * Does not require requestLog or createdBy.
   */
  async createForMigration(
    payload: IJobMigrationCreate
  ): Promise<DatabaseIdDto> {
    const slug = this.jobUtil.createSlug(payload.title);

    const data: Prisma.JobCreateInput = {
      title: payload.title,
      slug: slug,
      description: payload.description,
      requirements: payload.requirements,
      location: payload.location,
      salaryRange: payload.salaryRange,
      applicationDeadline: payload.applicationDeadline,
      category: payload.category,
      jobType: payload.jobType,
      status: payload.status ?? EnumJobStatus.draft,
    };

    const created = await this.jobRepository.create(data);
    return { id: created.id };
  }

  /**
   * Hard-delete all job records.
   * Intended for use in migration seeds only.
   */
  async deleteMany(): Promise<void> {
    await this.jobRepository.deleteMany({});
  }
}
