import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { JobApplicationModel } from '../models/job-application.model';
import { JobApplicationMapper } from '../mappers/job-application.mapper';
import { IJobApplicationListFilters } from '../interfaces/job-application.filter.interface';
import {
  JobApplication as PrismaJobApplication,
  Prisma,
} from '@/generated/prisma-client';

@Injectable()
export class JobApplicationRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationOffsetReturn<JobApplicationModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaJobApplication,
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >(this.databaseService.jobApplication, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        job: true,
      },
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        JobApplicationMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationCursorReturn<JobApplicationModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaJobApplication,
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >(this.databaseService.jobApplication, {
      ...params,
      where: {
        ...where,
        ...filters,
        deletedAt: null,
      },
      include: {
        job: true,
      },
      includeCount: true,
    } as any);

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        JobApplicationMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<JobApplicationModel | null> {
    const result = await this.databaseService.jobApplication.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });
    return result ? JobApplicationMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.JobApplicationWhereInput
  ): Promise<JobApplicationModel | null> {
    const result = await this.databaseService.jobApplication.findFirst({
      where,
      include: {
        job: true,
      },
    });
    return result ? JobApplicationMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.JobApplicationCreateInput
  ): Promise<JobApplicationModel> {
    const result = await this.databaseService.jobApplication.create({
      data,
      include: {
        job: true,
      },
    });
    return JobApplicationMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.JobApplicationUpdateInput
  ): Promise<JobApplicationModel> {
    const result = await this.databaseService.jobApplication.update({
      where: { id },
      data,
      include: {
        job: true,
      },
    });
    return JobApplicationMapper.toDomain(result);
  }

  async delete(id: string): Promise<JobApplicationModel> {
    const result = await this.databaseService.jobApplication.delete({
      where: { id },
    });
    return JobApplicationMapper.toDomain(result);
  }

  async getTotal(where: Prisma.JobApplicationWhereInput): Promise<number> {
    return this.databaseService.jobApplication.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }
}
