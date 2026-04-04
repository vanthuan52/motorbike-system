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
import { ApplicationReviewModel } from '../models/application-review.model';
import {
  Prisma,
  ApplicationReview as PrismaApplicationReview,
} from '@/generated/prisma-client';
import { ApplicationReviewMapper } from '../mappers/application-review.mapper';

import { IApplicationReviewListFilters } from '../interfaces/application-review.filter.interface';

@Injectable()
export class ApplicationReviewRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationOffsetReturn<ApplicationReviewModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaApplicationReview,
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >(this.databaseService.applicationReview, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
        jobApplication: true,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ApplicationReviewMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    filters?: IApplicationReviewListFilters
  ): Promise<IPaginationCursorReturn<ApplicationReviewModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaApplicationReview,
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >(this.databaseService.applicationReview, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
        jobApplication: true,
      },
      includeCount: true,
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        ApplicationReviewMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<ApplicationReviewModel | null> {
    const result = await this.databaseService.applicationReview.findUnique({
      where: { id },
      include: {
        user: true,
        jobApplication: true,
      },
    });
    return result ? ApplicationReviewMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.ApplicationReviewWhereInput
  ): Promise<ApplicationReviewModel | null> {
    const result = await this.databaseService.applicationReview.findFirst({
      where,
      include: {
        user: true,
        jobApplication: true,
      },
    });
    return result ? ApplicationReviewMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.ApplicationReviewCreateInput
  ): Promise<ApplicationReviewModel> {
    const result = await this.databaseService.applicationReview.create({
      data,
      include: {
        user: true,
        jobApplication: true,
      },
    });
    return ApplicationReviewMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.ApplicationReviewUpdateInput
  ): Promise<ApplicationReviewModel> {
    const result = await this.databaseService.applicationReview.update({
      where: { id },
      data,
      include: {
        user: true,
        jobApplication: true,
      },
    });
    return ApplicationReviewMapper.toDomain(result);
  }

  async delete(id: string): Promise<ApplicationReviewModel> {
    const result = await this.databaseService.applicationReview.delete({
      where: { id },
    });
    return ApplicationReviewMapper.toDomain(result);
  }
}
