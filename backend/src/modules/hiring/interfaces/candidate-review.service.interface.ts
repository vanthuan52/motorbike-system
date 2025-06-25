import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
} from '@/common/database/interfaces/database.interface';
import {
  CandidateReviewDoc,
  CandidateReviewEntity,
} from '../entities/candidate-review.entity';
import { CandidateReviewAdminCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { CandidateReviewListResponseDto } from '../dtos/response/candidate-review.list.response.dto';
import { CandidateReviewGetResponseDto } from '../dtos/response/candidate-review.get.response.dto';

export interface ICandidateReviewService {
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CandidateReviewDoc[]>;

  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number>;

  create(
    payload: CandidateReviewAdminCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CandidateReviewDoc>;

  mapList(
    Candidates: CandidateReviewDoc[] | CandidateReviewEntity[],
  ): CandidateReviewListResponseDto[];

  mapGet(
    CandidateReview: CandidateReviewDoc | CandidateReviewEntity,
  ): CandidateReviewGetResponseDto;
}
