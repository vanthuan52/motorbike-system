import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import {
  RoleDocParamsId,
  RoleDocQueryIsActive,
  RoleDocQueryType,
} from '../constants/role.doc.constant';
import { RoleListResponseDto } from '../dtos/response/role.list.response.dto';
import { RoleGetResponseDto } from '../dtos/response/role.get.response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { RoleCreateRequestDto } from '../dtos/request/role.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { RoleUpdateRequestDto } from '../dtos/request/role.update.request.dto';

export function RoleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all of roles',
    }),
    DocRequest({
      queries: [...RoleDocQueryIsActive, ...RoleDocQueryType],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<RoleListResponseDto>('role.list', {
      dto: RoleListResponseDto,
    }),
  );
}

export function RoleAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a role',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<RoleGetResponseDto>('role.get', {
      dto: RoleGetResponseDto,
    }),
  );
}

export function RoleAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a role',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: RoleCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('role.create', {
      httpStatus: HttpStatus.CREATED,
      dto: DatabaseIdResponseDto,
    }),
  );
}

export function RoleAdminActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make role be active',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('role.active'),
  );
}

export function RoleAdminInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'make role be inactive',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('role.inactive'),
  );
}

export function RoleAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update data a role',
    }),
    DocRequest({
      params: RoleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: RoleUpdateRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('role.update', {
      dto: DatabaseIdResponseDto,
    }),
  );
}

export function RoleAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete data a role',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('role.delete'),
  );
}
