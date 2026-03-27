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
import { CandidateReviewModel } from '../models/candidate-review.model';
import {
  Prisma,
  CandidateReview as PrismaCandidateReview,
} from '@/generated/prisma-client';
import { CandidateReviewMapper } from '../mappers/candidate-review.mapper';

@Injectable()
export class CandidateReviewRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateReviewModel>> {
    const paginatedResult = await this.paginationService.offset<
      PrismaCandidateReview,
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >(this.databaseService.candidateReview, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
        candidate: true,
      },
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CandidateReviewMapper.toDomain(item)
      ),
    };
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateReviewModel>> {
    const paginatedResult = await this.paginationService.cursor<
      PrismaCandidateReview,
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >(this.databaseService.candidateReview, {
      ...params,
      where: {
        ...where,
        ...filters,
      },
      include: {
        user: true,
        candidate: true,
      },
      includeCount: true,
    });

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item =>
        CandidateReviewMapper.toDomain(item)
      ),
    };
  }

  async findOneById(id: string): Promise<CandidateReviewModel | null> {
    const result = await this.databaseService.candidateReview.findUnique({
      where: { id },
      include: {
        user: true,
        candidate: true,
      },
    });
    return result ? CandidateReviewMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.CandidateReviewWhereInput
  ): Promise<CandidateReviewModel | null> {
    const result = await this.databaseService.candidateReview.findFirst({
      where,
      include: {
        user: true,
        candidate: true,
      },
    });
    return result ? CandidateReviewMapper.toDomain(result) : null;
  }

  async create(
    data: Prisma.CandidateReviewCreateInput
  ): Promise<CandidateReviewModel> {
    const result = await this.databaseService.candidateReview.create({
      data,
      include: {
        user: true,
        candidate: true,
      },
    });
    return CandidateReviewMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.CandidateReviewUpdateInput
  ): Promise<CandidateReviewModel> {
    const result = await this.databaseService.candidateReview.update({
      where: { id },
      data,
      include: {
        user: true,
        candidate: true,
      },
    });
    return CandidateReviewMapper.toDomain(result);
  }

  async delete(id: string): Promise<CandidateReviewModel> {
    const result = await this.databaseService.candidateReview.delete({
      where: { id },
    });
    return CandidateReviewMapper.toDomain(result);
  }
}
