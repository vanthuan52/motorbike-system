import { Injectable, NotFoundException } from '@nestjs/common';
import { CandidateReviewRepository } from '../repository/candidate-review.repository';
import { ICandidateReviewService } from '../interfaces/candidate-review.service.interface';
import { CandidateReviewCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { EnumHiringStatusCodeError } from '../enums/hiring.status-code.enum';
import { CandidateReviewModel } from '../models/candidate-review.model';
import { Prisma } from '@/generated/prisma-client';

@Injectable()
export class CandidateReviewService implements ICandidateReviewService {
  constructor(
    private readonly candidateReviewRepository: CandidateReviewRepository
  ) {}

  async getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateReviewModel>> {
    return this.candidateReviewRepository.findWithPaginationOffset(
      pagination,
      filters
    );
  }

  async getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateReviewModel>> {
    return this.candidateReviewRepository.findWithPaginationCursor(
      pagination,
      filters
    );
  }

  async findOneById(id: string): Promise<CandidateReviewModel | null> {
    return this.candidateReviewRepository.findOneById(id);
  }

  async findOne(
    where: Prisma.CandidateReviewWhereInput
  ): Promise<CandidateReviewModel | null> {
    return this.candidateReviewRepository.findOne(where);
  }

  async create(
    payload: CandidateReviewCreateRequestDto
  ): Promise<DatabaseIdDto> {
    const created = await this.candidateReviewRepository.create({
      feedback: payload.feedback,
      user: {
        connect: { id: payload.user },
      },
      candidate: {
        connect: { id: payload.candidate },
      },
    });

    return { id: created.id };
  }

  async delete(id: string): Promise<void> {
    await this.findOneByIdOrFail(id);
    await this.candidateReviewRepository.delete(id);
  }

  private async findOneByIdOrFail(id: string): Promise<CandidateReviewModel> {
    const review = await this.candidateReviewRepository.findOneById(id);

    if (!review) {
      throw new NotFoundException({
        statusCode: EnumHiringStatusCodeError.notFound,
        message: 'candidate.error.notFound',
      });
    }

    return review;
  }
}
