import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import {
  CandidateDocQueryDate,
  CandidateDocQueryHiringId,
  CandidateDocQueryStatus,
} from '../constants/candidate-doc.constants';
import { HiringDocParamsId } from '../constants/hiring-doc.constants';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CandidateResponseDto } from '../dtos/candidate-response.dto';

export function CandidateAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all candidate',
    }),
    DocRequest({
      queries: [
        ...CandidateDocQueryStatus,
        ...CandidateDocQueryHiringId,
        ...CandidateDocQueryDate,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CandidateResponseDto>('candidate.list', {
      dto: CandidateResponseDto,
    }),
  );
}

export function CandidateAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail an candidate' }),
    DocRequest({
      params: HiringDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CandidateResponseDto>('candidate.getById', {
      dto: CandidateResponseDto,
    }),
  );
}

export function CandidateAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update status of candidate' }),
    DocRequest({
      params: HiringDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('candidate.updateStatus'),
  );
}
