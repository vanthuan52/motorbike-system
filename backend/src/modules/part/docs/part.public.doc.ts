import { applyDecorators } from '@nestjs/common';

import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import {
  PartDocParamsSlug,
  PartDocQueryOrderBy,
  PartDocQueryOrderDirection,
  PartDocQueryPartType,
  PartDocQueryStatus,
  PartDocQueryVehicleBrand,
} from '../constants/part.doc.constant';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';

export function PartPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part',
    }),
    DocRequest({
      queries: [
        ...PartDocQueryVehicleBrand,
        ...PartDocQueryPartType,
        ...PartDocQueryStatus,
        ...PartDocQueryOrderBy,
        ...PartDocQueryOrderDirection,
      ],
    }),
    DocResponsePaging<PartListResponseDto>('part.list', {
      dto: PartListResponseDto,
    }),
  );
}

export function PartPublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a part by slug',
    }),
    DocRequest({
      params: PartDocParamsSlug,
    }),
    DocResponse<PartGetFullResponseDto>('part.getBySlug', {
      dto: PartGetFullResponseDto,
    }),
  );
}
