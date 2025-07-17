import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  UserVehicleDocParamsId,
  UserVehicleDocQueryVehicleModel,
  UserVehicleDocQueryOrderBy,
  UserVehicleDocQueryOrderDirection,
} from '../constants/user-vehicle.doc.constant';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { UserVehicleCreateRequestDto } from '../dtos/request/user-vehicle.create.request.dto';
import { UserVehicleUpdateRequestDto } from '../dtos/request/user-vehicle.update.request.dto';
import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import { UserVehicleGetFullResponseDto } from '../dtos/response/user-vehicle.full.response.dto';

export function UserVehicleAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all user vehicles',
    }),
    DocRequest({
      queries: [
        ...UserVehicleDocQueryVehicleModel,
        ...UserVehicleDocQueryOrderBy,
        ...UserVehicleDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<UserVehicleListResponseDto>('user-vehicle.list', {
      dto: UserVehicleListResponseDto,
    }),
  );
}

export function UserVehicleAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new user vehicle',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserVehicleCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('user-vehicle.create', {
      dto: DatabaseIdResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function UserVehicleAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a user vehicle',
    }),
    DocRequest({
      params: UserVehicleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: UserVehicleUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user-vehicle.update'),
  );
}

export function UserVehicleAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a user vehicle',
    }),
    DocRequest({
      params: UserVehicleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('user-vehicle.delete'),
  );
}

export function UserVehicleAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a user vehicle by id',
    }),
    DocRequest({
      params: UserVehicleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserVehicleGetResponseDto>('user-vehicle.getById', {
      dto: UserVehicleGetResponseDto,
    }),
  );
}

export function UserVehicleAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a user vehicle',
    }),
    DocRequest({
      params: UserVehicleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<UserVehicleGetFullResponseDto>('user-vehicle.get', {
      dto: UserVehicleGetFullResponseDto,
    }),
  );
}
