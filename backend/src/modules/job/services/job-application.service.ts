import { Injectable, NotFoundException } from '@nestjs/common';
import { JobApplicationRepository } from '../repository/job-application.repository';
import { IJobApplicationService } from '../interfaces/job-application.service.interface';
import { JobApplicationUserCreateRequestDto } from '../dtos/request/job-application.create.request.dto';
import { JobApplicationUpdateStatusRequestDto } from '../dtos/request/job-application.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  IPaginationCursorReturn,
  IPaginationOffsetReturn,
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumJobStatusCodeError } from '../enums/job.status-code.enum';
import { JobApplicationModel } from '../models/job-application.model';
import { IJobApplicationListFilters } from '../interfaces/job-application.filter.interface';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class JobApplicationService implements IJobApplicationService {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationOffsetReturn<JobApplicationModel>> {
    return this.jobApplicationRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    filters?: IJobApplicationListFilters
  ): Promise<IPaginationCursorReturn<JobApplicationModel>> {
    return this.jobApplicationRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<JobApplicationModel | null> {
    return this.jobApplicationRepository.findOneById(id);
  }

  async findOne(
    where: Prisma.JobApplicationWhereInput
  ): Promise<JobApplicationModel | null> {
    return this.jobApplicationRepository.findOne(where);
  }

  async create(
    payload: JobApplicationUserCreateRequestDto
  ): Promise<DatabaseIdDto> {
    const created = await this.jobApplicationRepository.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      appliedAt: payload.appliedAt,
      cv: payload.cv,
      experience: payload.experience,
      education: payload.education,
      job: {
        connect: { id: payload.job },
      },
    });

    return { id: created.id };
  }

  async updateStatus(
    id: string,
    { status }: JobApplicationUpdateStatusRequestDto
  ): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.jobApplicationRepository.update(id, { status: status as any });
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.jobApplicationRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<JobApplicationModel> {
    const jobApplication = await this.jobApplicationRepository.findOneById(id);

    if (!jobApplication) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'jobApplication.error.notFound',
      });
    }

    return jobApplication;
  }

  /**
   * Hard-delete all job application records.
   * Intended for use in migration seeds only.
   */
  async deleteMany(): Promise<void> {
    await this.jobApplicationRepository.deleteMany();
  }
}
