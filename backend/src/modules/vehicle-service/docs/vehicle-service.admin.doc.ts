import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  VehicleServiceDocParamsId,
  VehicleServiceDocQueryCategory,
  VehicleServiceDocQueryOrderBy,
  VehicleServiceDocQueryOrderDirection,
  VehicleServiceDocQueryStatus,
} from '../constants/vehicle-service.doc.constant';
import { VehicleServiceDto } from '../dtos/vehicle-service.dto';
import { VehicleServiceListResponseDto } from '../dtos/response/vehicle-service.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { VehicleServiceCreateRequestDto } from '../dtos/request/vehicle-service.create.request.dto';
import { VehicleServiceUpdateRequestDto } from '../dtos/request/vehicle-service.update.request.dto';
import { VehicleServiceUpdateStatusRequestDto } from '../dtos/request/vehicle-service.update-status.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import { VehicleServiceGetFullResponseDto } from '../dtos/response/vehicle-service.full.response.dto';
import { AwsS3Dto } from '@/common/aws/dtos/aws.s3.dto';
import { AwsS3PresignRequestDto } from '@/common/aws/dtos/request/aws.s3-presign.request.dto';

export function VehicleAdminServiceListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all vehicle services',
    }),
    DocRequest({
      queries: [
        ...VehicleServiceDocQueryCategory,
        ...VehicleServiceDocQueryStatus,
        ...VehicleServiceDocQueryOrderBy,
        ...VehicleServiceDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<VehicleServiceListResponseDto>('vehicle-service.list', {
      dto: VehicleServiceListResponseDto,
    }),
  );
}

export function VehicleAdminServiceCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new vehicle service',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleServiceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('vehicle-service.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function VehicleAdminServiceUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleServiceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.update'),
  );
}

export function VehicleAdminServiceDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.delete'),
  );
}

export function VehicleAdminServiceUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a vehicle service',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: VehicleServiceUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('vehicle-service.updateStatus'),
  );
}

export function VehicleAdminServiceParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a vehicle service by id',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleServiceDto>('vehicle-service.getById', {
      dto: VehicleServiceDto,
    }),
  );
}

export function VehicleAdminServiceGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a vehicle',
    }),
    DocRequest({
      params: VehicleServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<VehicleServiceGetFullResponseDto>('vehicle-service.get', {
      dto: VehicleServiceGetFullResponseDto,
    }),
  );
}

export function VehicleAdminServiceUploadPhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get presign url for photo vehicle service',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocResponse<AwsS3Dto>('vehicle-service.uploadPhoto', {
      dto: AwsS3Dto,
    }),
  );
}

export function VehicleAdminServiceUpdatePhotoDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update photo vehicle service',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AwsS3PresignRequestDto,
    }),
    DocResponse('vehicle-service.updatePhoto'),
  );
}
