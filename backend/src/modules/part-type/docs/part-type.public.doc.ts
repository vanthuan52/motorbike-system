import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  PartTypeDocParamsSlug,
  PartTypeDocQueryStatus,
} from '../constants/part-type.doc.constant';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';

export function PartTypePublicGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one part type by slug',
    }),
    DocRequest({
      params: PartTypeDocParamsSlug,
    }),
    DocResponse<PartTypeGetResponseDto>('part-type.get', {
      dto: PartTypeGetResponseDto,
    }),
  );
}

export function PartTypePublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part types',
    }),
    DocRequest({
      queries: [...PartTypeDocQueryStatus],
    }),
    DocResponsePaging<PartTypeListResponseDto>('part-type.list', {
      dto: PartTypeListResponseDto,
    }),
  );
}
