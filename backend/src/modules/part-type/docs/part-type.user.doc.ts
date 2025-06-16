import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { PartTypeDocQueryStatus } from '../constants/part-type.doc.constant';
import { PartTypeListResponseDto } from '../dtos/response/part-type.list.response.dto';
import { PartTypeGetResponseDto } from '../dtos/response/part-type.get.response.dto';

export function PartTypeUserGetOneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get one part type',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard(),
    DocResponse('part-type.get-one'),
  );
}

export function PartTypeUserListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part types',
    }),
    DocRequest({
      queries: [...PartTypeDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PartTypeListResponseDto>('part-type.list', {
      dto: PartTypeListResponseDto,
    }),
  );
}

export function PartTypeAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an part type',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard(),
    DocResponse<PartTypeGetResponseDto>('part-type.get', {
      dto: PartTypeGetResponseDto,
    }),
  );
}