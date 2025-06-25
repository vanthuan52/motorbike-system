import { Injectable } from '@nestjs/common';
import {
  IDatabaseFindAllOptions,
  IDatabaseGetTotalOptions,
  IDatabaseCreateOptions,
  IDatabaseDeleteManyOptions,
} from '@/common/database/interfaces/database.interface';
import { plainToInstance } from 'class-transformer';
import { CandidateReviewRepository } from '../repository/candidate-review.repository';
import {
  CandidateReviewDoc,
  CandidateReviewEntity,
} from '../entities/candidate-review.entity';
import { CandidateReviewAdminCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { CandidateReviewListResponseDto } from '../dtos/response/candidate-review.list.response.dto';
import { CandidateReviewGetResponseDto } from '../dtos/response/candidate-review.get.response.dto';
import { ICandidateReviewService } from '../interfaces/candidate-review.service.interface';

@Injectable()
export class CandidateReviewService implements ICandidateReviewService {
  constructor(
    private readonly candidateReviewRepository: CandidateReviewRepository,
  ) {}
  findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<CandidateReviewDoc[]> {
    return this.candidateReviewRepository.findAll(find, options);
  }
  getTotal(
    find?: Record<string, any>,
    options?: IDatabaseGetTotalOptions,
  ): Promise<number> {
    return this.candidateReviewRepository.getTotal(find, options);
  }
  create(
    payload: CandidateReviewAdminCreateRequestDto,
    options?: IDatabaseCreateOptions,
  ): Promise<CandidateReviewDoc> {
    const create: CandidateReviewEntity = new CandidateReviewEntity();
    create.user = payload.user?.toString();
    create.candidate = payload.candidate?.toString();
    create.feedback = payload.feedback;
    create.createdAt = new Date();
    return this.candidateReviewRepository.create(create, options);
  }
  async deleteMany(
    find?: Record<string, any>,
    options?: IDatabaseDeleteManyOptions,
  ): Promise<boolean> {
    this.candidateReviewRepository.deleteMany(find, options);
    return true;
  }

  mapList(
    candidateReviews: CandidateReviewDoc[] | CandidateReviewEntity[],
  ): CandidateReviewListResponseDto[] {
    return plainToInstance(
      CandidateReviewListResponseDto,
      candidateReviews.map((e: CandidateReviewDoc | CandidateReviewEntity) =>
        typeof (e as any).toObject === 'function' ? (e as any).toObject() : e,
      ),
    );
  }

  mapGet(
    candidateReview: CandidateReviewDoc | CandidateReviewEntity,
  ): CandidateReviewGetResponseDto {
    return plainToInstance(
      CandidateReviewGetResponseDto,
      typeof (candidateReview as any).toObject === 'function'
        ? (candidateReview as any).toObject()
        : candidateReview,
    );
  }
}
