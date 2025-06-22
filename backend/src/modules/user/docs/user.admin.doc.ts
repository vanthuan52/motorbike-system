import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  UserDocParamsId,
  UserDocQueryRoleType,
  UserDocQueryStatus,
} from '../constants/user.doc.constant';
import { UserListResponseDto } from '../dtos/response/user.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { UserProfileResponseDto } from '../dtos/response/user.profile.response.dto';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import {
  UserCreateRequestDto,
  UserTypeUserCreateRequestDto,
} from '../dtos/request/user.create.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';

export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all users',
    }),
    DocRequest({
      queries: [...UserDocQueryStatus, ...UserDocQueryRoleType],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<UserListResponseDto>('user.list', {
      dto: UserListResponseDto,
    }),
  );
}

export function UserAdminListUserTypeUserDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all users with type USER',
    }),
    DocRequest({
      queries: [...UserDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<UserListResponseDto>('user.list', {
      dto: UserListResponseDto,
    }),
  );
}

export function UserAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserProfileResponseDto>('user.get', {
      dto: UserProfileResponseDto,
    }),
  );
}

export function UserAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a user',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('user.create', {
      httpStatus: HttpStatus.CREATED,
      dto: DatabaseIdResponseDto,
    }),
  );
}

export function UserTypeUserAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a user with type user',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserTypeUserCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('user.create', {
      httpStatus: HttpStatus.CREATED,
      dto: DatabaseIdResponseDto,
    }),
  );
}

export function UserAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a user',
    }),
    DocRequest({
      params: UserDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserUpdateRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user.update'),
  );
}

export function UserAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of user',
    }),
    DocRequest({
      params: UserDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserUpdateStatusRequestDto,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user.updateStatus'),
  );
}
