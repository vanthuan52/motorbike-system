import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import {
  PermissionDocParamsId,
  PermissionDocQueryList,
} from '@/modules/permission/constants/permission.doc.constant';
import { PermissionCreateRequestDto } from '@/modules/permission/dtos/request/permission.create.request.dto';
import { PermissionUpdateRequestDto } from '@/modules/permission/dtos/request/permission.update.request.dto';
import { PermissionListResponseDto } from '@/modules/permission/dtos/response/permission.list.response.dto';
import { PermissionDto } from '@/modules/permission/dtos/permission.dto';

export function PermissionAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get list of permissions',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      queries: PermissionDocQueryList,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PermissionListResponseDto>('permission.list', {
      dto: PermissionListResponseDto,
    })
  );
}

export function PermissionAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a permission',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      params: PermissionDocParamsId,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PermissionDto>('Permission.get', {
      dto: PermissionDto,
    })
  );
}

export function PermissionAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a Permission',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: PermissionCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PermissionDto>('Permission.create', {
      httpStatus: HttpStatus.CREATED,
      dto: PermissionDto,
    })
  );
}

export function PermissionAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update data a Permission',
    }),
    DocRequest({
      params: PermissionDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: PermissionUpdateRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PermissionDto>('Permission.update', {
      dto: PermissionDto,
    })
  );
}

export function PermissionAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete data a Permission',
    }),
    DocRequest({
      params: PermissionDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('Permission.delete')
  );
}
