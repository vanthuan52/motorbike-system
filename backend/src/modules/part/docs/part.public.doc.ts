import { applyDecorators } from '@nestjs/common';

import { PartGetResponseDto } from '../dtos/response/part.get.response.dto';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import {
  PartDocParamsSlug,
  PartDocQueryOrderBy,
  PartDocQueryOrderDirection,
  PartDocQueryStatus,
  PartDocQueryType,
} from '../constants/part.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';

export function PartPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part',
    }),
    DocRequest({
      queries: [
        ...PartDocQueryType,
        ...PartDocQueryStatus,
        ...PartDocQueryOrderBy,
        ...PartDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PartListResponseDto>('part.list', {
      dto: PartListResponseDto,
    }),
  );
}

export function PartPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get part by slug',
    }),
    DocRequest({
      params: PartDocParamsSlug,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PartGetResponseDto>('part.getBySlug', {
      dto: PartGetResponseDto,
    }),
  );
}
