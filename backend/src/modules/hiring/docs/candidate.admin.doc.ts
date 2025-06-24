import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { CandidateListResponseDto } from '../dtos/response/candidate.list.response.dto';
import {
  CandidateDocQueryDate,
  CandidateDocQueryHiringId,
  CandidateDocQueryStatus,
} from '../constants/candidate-doc.constants';
import { HiringDocParamsId } from '../constants/hiring-doc.constants';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CandidateGetResponseDto } from '../dtos/response/candidate.get.response.dto';

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
    DocResponsePaging<CandidateListResponseDto>('candidate.list', {
      dto: CandidateListResponseDto,
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
    DocResponse<CandidateGetResponseDto>('candidate.getById', {
      dto: CandidateGetResponseDto,
    }),
  );
}

export function CandidateUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update status of candidate' }),
    DocRequest({
      params: HiringDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('candidate.updateStatus'),
  );
}
