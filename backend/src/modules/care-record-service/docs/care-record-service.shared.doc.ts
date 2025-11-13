import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceGetResponseDto } from '../dtos/response/care-record-service.get.response.dto';
import { CareRecordServiceListResponseDto } from '../dtos/response/care-record-service.list.response.dto';
import { CareRecordServiceUpdateRequestDto } from '../dtos/request/care-record-service.update.request.dto';
import {
  CareRecordServiceDocParamsId,
  CareRecordServiceDocQueryCareRecord,
  CareRecordServiceDocQueryStatus,
} from '../constants/care-record-service.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';

export function CareRecordServiceSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record service',
    }),
    DocRequest({
      queries: [
        ...CareRecordServiceDocQueryCareRecord,
        ...CareRecordServiceDocQueryStatus,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordServiceListResponseDto>(
      'care-record-Service.list',
      {
        dto: CareRecordServiceListResponseDto,
      },
    ),
  );
}

export function CareRecordServiceSharedCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record service',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordServiceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordServiceGetResponseDto>('care-record-service.create', {
      dto: CareRecordServiceGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordServiceSharedUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordServiceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-Service.update'),
  );
}

export function CareRecordServiceSharedDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record Service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-service.delete'),
  );
}

export function CareRecordServiceSharedParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record service by id',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordServiceGetResponseDto>(
      'care-record-service.getById',
      {
        dto: CareRecordServiceGetResponseDto,
      },
    ),
  );
}

export function CareRecordServiceSharedGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordServiceGetFullResponseDto>(
      'care-record-service.get',
      {
        dto: CareRecordServiceGetFullResponseDto,
      },
    ),
  );
}

export function CareRecordServiceSharedUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordServiceUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-service.updateStatus'),
  );
}

export function CareRecordServiceSharedListWithChecklistsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record services with their checklists',
    }),
    DocRequest({
      queries: [
        ...CareRecordServiceDocQueryCareRecord,
        ...CareRecordServiceDocQueryStatus,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordServiceWithChecklistsResponseDto>(
      'care-record-service.listWithChecklists',
      {
        dto: CareRecordServiceWithChecklistsResponseDto,
      },
    ),
  );
}
