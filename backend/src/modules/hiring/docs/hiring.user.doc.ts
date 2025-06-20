import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { HiringGetResponseDto } from '../dtos/response/hiring.get.response.dto';
import {
  HiringDocParamsId,
  HiringDocQueryStatus,
} from '../constants/hiring-doc.constants';
import { HiringListResponseDto } from '../dtos/response/hiring.list.response.dto';

export function HiringUserGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an hiring',
    }),
    DocRequest({
      params: HiringDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<HiringGetResponseDto>('hiring.getById', {
      dto: HiringGetResponseDto,
    }),
  );
}

export function HiringUserListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all hiring',
    }),
    DocRequest({
      queries: [...HiringDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<HiringListResponseDto>('hiring.list', {
      dto: HiringListResponseDto,
    }),
  );
}
