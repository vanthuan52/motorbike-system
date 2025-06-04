import {
  Doc,
  DocRequest,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import { RoleDocQueryType } from '../constants/role.doc.constant';
import { RoleShortResponseDto } from '../dtos/response/role.short.response.dto';

export function RoleSystemListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of roles',
    }),
    DocRequest({
      queries: RoleDocQueryType,
    }),
    DocResponsePaging<RoleShortResponseDto>('role.list', {
      dto: RoleShortResponseDto,
    }),
  );
}
