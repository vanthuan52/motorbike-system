import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  UserDocParamsId,
  UserDocQueryList,
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
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { UserCreateRequestDto } from '../dtos/request/user.create.request.dto';
import { UserUpdateRequestDto } from '../dtos/request/user.update.request.dto';
import { UserUpdateStatusRequestDto } from '../dtos/request/user.update-status.request.dto';
import {
  UserCheckEmailRequestDto,
  UserCheckPhoneRequestDto,
} from '../dtos/request/user.check.request.dto';
import { UserCheckEmailResponseDto } from '../dtos/response/user.check-email.response.dto';
import { UserCheckPhoneResponseDto } from '../dtos/response/user.check-phone.response.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { UserCreateShadowUserRequestDto } from '../dtos/request/user.create-shadow-user.request.dto';
export function UserAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all users',
    }),
    DocRequest({
      queries: UserDocQueryList,
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
      bodyType: EnumDocRequestBodyType.json,
      dto: UserCreateRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('user.create', {
      httpStatus: HttpStatus.CREATED,
      dto: DatabaseIdDto,
    }),
  );
}

export function UserAdminCreateShadowUserDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a shadow user',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: UserCreateShadowUserRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('user.createShadowUser', {
      httpStatus: HttpStatus.CREATED,
      dto: DatabaseIdDto,
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
      bodyType: EnumDocRequestBodyType.json,
      dto: UserUpdateRequestDto,
    }),
    DocAuth({
      xApiKey: false,
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
      bodyType: EnumDocRequestBodyType.json,
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

export function UserAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete an user',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user.deleted'),
  );
}

export function UserAdminCheckEmailDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'check user exist by email',
    }),
    DocRequest({
      dto: UserCheckEmailRequestDto,
      bodyType: EnumDocRequestBodyType.json,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocResponse<UserCheckEmailResponseDto>('user.checkEmail', {
      dto: UserCheckEmailResponseDto,
    }),
  );
}

export function UserAdminCheckPhoneDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'check user exist by phone',
    }),
    DocRequest({
      dto: UserCheckPhoneRequestDto,
      bodyType: EnumDocRequestBodyType.json,
    }),
    DocAuth({
      xApiKey: false,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserCheckPhoneResponseDto>('user.checkPhone', {
      dto: UserCheckPhoneResponseDto,
    }),
  );
}
