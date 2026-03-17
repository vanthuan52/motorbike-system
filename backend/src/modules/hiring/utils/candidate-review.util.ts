import { Injectable } from '@nestjs/common';
import {
  CandidateReviewDoc,
  CandidateReviewEntity,
} from '../entities/candidate-review.entity';
import { CandidateReviewResponseDto } from '../dtos/candidate-review-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CandidateReviewUtil {
  mapList(
    candidateReviews: CandidateReviewDoc[] | CandidateReviewEntity[],
  ): CandidateReviewResponseDto[] {
    return plainToInstance(CandidateReviewResponseDto, candidateReviews);
  }

  mapOne(
    candidateReview: CandidateReviewDoc | CandidateReviewEntity,
  ): CandidateReviewResponseDto {
    return plainToInstance(CandidateReviewResponseDto, candidateReview);
  }

  //   mapList(
  //     candidateReviews: CandidateReviewDoc[] | CandidateReviewEntity[],
  //   ): CandidateReviewListResponseDto[] {
  //     return plainToInstance(
  //       CandidateReviewListResponseDto,
  //       candidateReviews.map((e: CandidateReviewDoc | CandidateReviewEntity) =>
  //         typeof (e as any).toObject === 'function' ? (e as any).toObject() : e,
  //       ),
  //     );
  //   }

  //   mapGet(
  //     candidateReview: CandidateReviewDoc | CandidateReviewEntity,
  //   ): CandidateReviewGetResponseDto {
  //     return plainToInstance(
  //       CandidateReviewGetResponseDto,
  //       typeof (candidateReview as any).toObject === 'function'
  //         ? (candidateReview as any).toObject()
  //         : candidateReview,
  //     );
  //   }
}
