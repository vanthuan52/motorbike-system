import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  CandidateDocQueryCandidateId,
  // CandidateDocQueryMore, // Removed as we use standard pagination now
} from '../constants/candidate-review.doc.constants';
import { CandidateReviewCreateRequestDto } from '../dtos/request/candidate-review.create.request.dto';
import { CandidateReviewResponseDto } from '../dtos/candidate-review-response.dto';

export function CandidateReviewAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all candidate reviews',
    }),
    DocRequest({
      queries: [...CandidateDocQueryCandidateId],
      // Removed More query
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CandidateReviewResponseDto>('candidate-review.list', {
      dto: CandidateReviewResponseDto,
    }),
  );
}

export function CandidateReviewAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new candidate review' }),
    DocRequest({
      queries: [],
      dto: CandidateReviewCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('candidate-review.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdDto,
    }),
  );
}
