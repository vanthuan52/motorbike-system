import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { CandidateReviewListResponseDto } from '../dtos/response/candidate-review.list.response.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import {
  CandidateDocQueryCandidateId,
  CandidateDocQueryMore,
} from '../constants/candidate-review.doc.constants';
import { CandidateReviewAdminCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';

export function CandidateReviewAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all candidate reviews',
    }),
    DocRequest({
      queries: [...CandidateDocQueryCandidateId, ...CandidateDocQueryMore],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CandidateReviewListResponseDto>('candidate-review.list', {
      dto: CandidateReviewListResponseDto,
    }),
  );
}

export function CandidateReviewAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new candidate review' }),
    DocRequest({
      queries: [],
      dto: CandidateReviewAdminCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('candidate.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdResponseDto,
    }),
  );
}
