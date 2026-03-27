import {
  IPaginationQueryCursorParams,
  IPaginationQueryOffsetParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
  IPaginationIn,
} from '@/common/pagination/interfaces/pagination.interface';
import { CandidateReviewCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { CandidateReviewModel } from '../models/candidate-review.model';
import { Prisma } from '@/generated/prisma-client';

export interface ICandidateReviewService {
  getListOffset(
    pagination: IPaginationQueryOffsetParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationOffsetReturn<CandidateReviewModel>>;

  getListCursor(
    pagination: IPaginationQueryCursorParams<
      Prisma.CandidateReviewSelect,
      Prisma.CandidateReviewWhereInput
    >,
    filters?: Record<string, IPaginationIn>
  ): Promise<IPaginationCursorReturn<CandidateReviewModel>>;

  findOneById(id: string): Promise<CandidateReviewModel | null>;

  findOne(
    where: Prisma.CandidateReviewWhereInput
  ): Promise<CandidateReviewModel | null>;

  create(payload: CandidateReviewCreateRequestDto): Promise<DatabaseIdDto>;

  delete(id: string): Promise<void>;
}
