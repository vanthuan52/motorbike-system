import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { JobModel } from '../models/job.model';
import { JobMapper } from '../mappers/job.mapper';
import { Job as PrismaJob, Prisma } from '@/generated/prisma-client';
import { IJobListFilters } from '../interfaces/job.filter.interface';

@Injectable()
export class JobRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<Prisma.JobSelect, Prisma.JobWhereInput>,
    filters?: IJobListFilters
  ): Promise<IPaginationOffsetReturn<JobModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaJob,
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >(this.databaseService.job, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => JobMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<Prisma.JobSelect, Prisma.JobWhereInput>,
    filters?: IJobListFilters
  ): Promise<IPaginationCursorReturn<JobModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaJob,
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >(this.databaseService.job, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => JobMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<JobModel | null> {
    const result = await this.databaseService.job.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    return result ? JobMapper.toDomain(result) : null;
  }

  async findOne(find: Record<string, any>): Promise<JobModel | null> {
    const result = await this.databaseService.job.findFirst({
      where: {
        ...find,
        deletedAt: null,
      },
    });
    return result ? JobMapper.toDomain(result) : null;
  }

  async findOneBySlug(slug: string): Promise<JobModel | null> {
    const result = await this.databaseService.job.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
    return result ? JobMapper.toDomain(result) : null;
  }

  async create(data: Prisma.JobCreateInput): Promise<JobModel> {
    const result = await this.databaseService.job.create({
      data,
    });
    return JobMapper.toDomain(result);
  }

  async update(id: string, data: Prisma.JobUpdateInput): Promise<JobModel> {
    const result = await this.databaseService.job.update({
      where: {
        id,
        deletedAt: null,
      },
      data,
    });
    return JobMapper.toDomain(result);
  }

  /**
   * Soft delete: sets deletedAt and deletedBy instead of removing the record.
   */
  async softDelete(id: string, deletedBy: string): Promise<JobModel> {
    const result = await this.databaseService.job.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });
    return JobMapper.toDomain(result);
  }

  /**
   * Restore a soft-deleted record by clearing deletedAt and deletedBy.
   */
  async restore(id: string, restoredBy: string): Promise<JobModel> {
    const result = await this.databaseService.job.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
        updatedBy: restoredBy,
      },
    });
    return JobMapper.toDomain(result);
  }

  /**
   * Permanently remove a record from the database.
   * WARNING: This action is irreversible. Only for superadmin.
   */
  async forceDelete(id: string): Promise<JobModel> {
    const result = await this.databaseService.job.delete({
      where: { id },
    });
    return JobMapper.toDomain(result);
  }

  /**
   * Find a job by ID regardless of soft-delete status.
   * Used for restore and trash detail operations.
   */
  async findOneByIdIncludeDeleted(id: string): Promise<JobModel | null> {
    const result = await this.databaseService.job.findUnique({
      where: { id },
    });
    return result ? JobMapper.toDomain(result) : null;
  }

  /**
   * Find trashed (soft-deleted) jobs with pagination.
   * Only returns records WHERE deletedAt IS NOT NULL.
   */
  async findWithPaginationOffsetTrashed({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.JobSelect,
    Prisma.JobWhereInput
  >): Promise<IPaginationOffsetReturn<JobModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaJob,
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >(this.databaseService.job, {
      ...params,
      where: {
        ...where,
        deletedAt: { not: null },
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => JobMapper.toDomain(item)),
    };
  }

  async getTotal(where: Prisma.JobWhereInput): Promise<number> {
    return this.databaseService.job.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
