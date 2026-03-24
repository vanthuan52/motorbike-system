import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';
import {
  PermissionDocParamsId,
  PermissionDocQueryList,
} from '@/modules/permission/constants/permission.doc.constant';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';

export function PermissionSystemListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of Permissions',
    }),
    DocRequest({
      queries: PermissionDocQueryList,
    }),
    DocAuth({
      xApiKey: true,
    }),
    DocResponsePaging<PermissionListResponseDto>('permission.list', {
      dto: PermissionListResponseDto,
      type: EnumPaginationType.cursor,
    })
  );
}
