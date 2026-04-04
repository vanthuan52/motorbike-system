import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationReviewRepository } from '../repository/application-review.repository';
import { IApplicationReviewService } from '../interfaces/application-review.service.interface';
import { ApplicationReviewCreateRequestDto } from '../dtos/request/application-review.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumJobStatusCodeError } from '../enums/job.status-code.enum';
import { ApplicationReviewModel } from '../models/application-review.model';
import { Prisma } from '@/generated/prisma-client';

import { IApplicationReviewListFilters } from '../interfaces/application-review.filter.interface';

@Injectable()
export class ApplicationReviewService implements IApplicationReviewService {
  constructor(
    private readonly applicationReviewRepository: ApplicationReviewRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationOffsetReturn<ApplicationReviewModel>> {
    return this.applicationReviewRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationCursorReturn<ApplicationReviewModel>> {
    return this.applicationReviewRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<ApplicationReviewModel | null> {
    return this.applicationReviewRepository.findOneById(id);
  }

  async findOne(
    where: Prisma.ApplicationReviewWhereInput
  ): Promise<ApplicationReviewModel | null> {
    return this.applicationReviewRepository.findOne(where);
  }

  async create(
    payload: ApplicationReviewCreateRequestDto
  ): Promise<DatabaseIdDto> {
    const created = await this.applicationReviewRepository.create({
      feedback: payload.feedback,
      user: {
        connect: { id: payload.user },
      },
      jobApplication: {
        connect: { id: payload.jobApplication },
      },
    });

    return { id: created.id };
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.applicationReviewRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<ApplicationReviewModel> {
    const review = await this.applicationReviewRepository.findOneById(id);

    if (!review) {
      throw new NotFoundException({
        statusCode: EnumJobStatusCodeError.notFound,
        message: 'jobApplication.error.notFound',
      });
    }

    return review;
  }
}
