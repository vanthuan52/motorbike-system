import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { AwsS3PresignRequestDto } from '@/modules/aws/dtos/request/aws.s3-presign.request.dto';
import { AwsS3PresignResponseDto } from '@/modules/aws/dtos/response/aws.s3-presign.response.dto';
import { UserVehicleListResponseDto } from '../dtos/response/user-vehicle.list.response.dto';
import {
  UserVehicleDocParamsId,
  UserVehicleDocQueryOrderBy,
  UserVehicleDocQueryOrderDirection,
  UserVehicleDocQueryVehicleModel,
} from '../constants/user-vehicle.doc.constant';
import { UserVehicleGetResponseDto } from '../dtos/response/user-vehicle.get.response.dto';
import { UserVehicleGetFullResponseDto } from '../dtos/response/user-vehicle.full.response.dto';

export function UserVehicleSharedUploadPhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get presign url for photo user vehicle',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse<AwsS3PresignResponseDto>('user-vehicle.uploadPhoto', {
      dto: AwsS3PresignResponseDto,
    }),
  );
}

export function UserVehicleSharedUpdatePhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo user vehicle',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AwsS3PresignRequestDto,
    }),
    DocResponse('user-vehicle.updatePhoto'),
  );
}

export function UserVehicleSharedListDoc(): MethodDecorator {
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

export function UserVehicleSharedParamsIdDoc(): MethodDecorator {
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

export function UserVehicleSharedGetDoc(): MethodDecorator {
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
