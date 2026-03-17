import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { HiringResponseDto } from '../dtos/hiring-response.dto';
import {
  HiringDocParamsId,
  HiringDocQueryStatus,
} from '../constants/hiring-doc.constants';

export function HiringPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all hiring (public)',
    }),
    DocRequest({
      queries: [...HiringDocQueryStatus],
    }),
    DocResponsePaging<HiringResponseDto>('hiring.public.list', {
      dto: HiringResponseDto,
    }),
  );
}

export function HiringPublicParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail a hiring (public)' }),
    DocRequest({
      params: HiringDocParamsId,
    }),
    DocResponse<HiringResponseDto>('hiring.public.getById', {
      dto: HiringResponseDto,
    }),
  );
}
