import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordCreateRequestDto } from '../dtos/request/care-record.create.request.dto';
import { CareRecordGetResponseDto } from '../dtos/response/care-record.get.response.dto';
import {
  ModelCareRecordListResponseDto,
  CareRecordListResponseDto,
} from '../dtos/response/care-record.list.response.dto';
import { CareRecordUpdateRequestDto } from '../dtos/request/care-record.update.request.dto';
import {
  CareRecordDocParamsId,
  CareRecordDocParamsVehicleModelId,
  CareRecordDocParamsVehicleServiceId,
  CareRecordDocQueryOrderBy,
  CareRecordDocQueryOrderDirection,
  CareRecordDocQueryStatus,
  CareRecordDocQueryVehicleModel,
  CareRecordDocQueryVehicleService,
} from '../constants/care-record.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordGetFullResponseDto } from '../dtos/response/care-record.full.response.dto';

export function CareRecordAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices',
    }),
    DocRequest({
      queries: [
        ...CareRecordDocQueryVehicleModel,
        ...CareRecordDocQueryVehicleService,
        ...CareRecordDocQueryStatus,
        ...CareRecordDocQueryOrderBy,
        ...CareRecordDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordListResponseDto>('care-record.list', {
      dto: CareRecordListResponseDto,
    }),
  );
}

export function CareRecordAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new CareRecord',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetResponseDto>('care-record.create', {
      dto: CareRecordGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a service price',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.update'),
  );
}

export function CareRecordAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a service price',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.delete'),
  );
}

export function CareRecordAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a service price by id',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetResponseDto>('care-record.getById', {
      dto: CareRecordGetResponseDto,
    }),
  );
}

export function CareRecordAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a CareRecord',
    }),
    DocRequest({
      params: CareRecordDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordGetFullResponseDto>('care-record.get', {
      dto: CareRecordGetFullResponseDto,
    }),
  );
}

export function CareRecordAdminListCombinedDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices with a set of services and models',
    }),
    DocRequest({
      queries: [
        ...CareRecordDocQueryVehicleModel,
        ...CareRecordDocQueryVehicleService,
        ...CareRecordDocQueryOrderBy,
        ...CareRecordDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ModelCareRecordListResponseDto>(
      'care-record.listByService',
      {
        dto: ModelCareRecordListResponseDto,
      },
    ),
  );
}

export function CareRecordAdminListCombinedByServiceDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service prices with a set of service and models',
    }),
    DocRequest({
      params: CareRecordDocParamsVehicleServiceId,
      queries: [
        ...CareRecordDocQueryOrderBy,
        ...CareRecordDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ModelCareRecordListResponseDto>(
      'care-record.listByService',
      {
        dto: ModelCareRecordListResponseDto,
      },
    ),
  );
}

export function CareRecordAdminListHistoryDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary:
        'get all service prices history for a set of a service and a model ',
    }),
    DocRequest({
      params: [
        ...CareRecordDocParamsVehicleServiceId,
        ...CareRecordDocParamsVehicleModelId,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordListResponseDto>('care-record.listHistory', {
      dto: CareRecordListResponseDto,
    }),
  );
}
