import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  RoleDocParamsId,
  RoleDocQueryList,
} from '../constants/role.doc.constant';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import { RoleAbilitiesResponseDto } from '../dtos/response/role.abilities.response.dto';

export function RoleSystemListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of roles',
    }),
    DocRequest({
      queries: RoleDocQueryList,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponsePaging<RoleListResponseDto>('role.list', {
      dto: RoleListResponseDto,
      type: EnumPaginationType.cursor,
    }),
  );
}

export function RoleSystemGetAbilitiesDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a role',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponse<RoleAbilitiesResponseDto>('role.getAbilities', {
      dto: RoleAbilitiesResponseDto,
    }),
  );
}
