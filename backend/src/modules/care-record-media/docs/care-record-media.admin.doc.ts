import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaGetResponseDto } from '../dtos/response/care-record-media.get.response.dto';
import { CareRecordMediaListResponseDto } from '../dtos/response/care-record-media.list.response.dto';
import { CareRecordMediaUpdateRequestDto } from '../dtos/request/care-record-media.update.request.dto';
import {
  CareRecordMediaDocParamsId,
  CareRecordMediaDocQueryCareRecord,
} from '../constants/care-record-media.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordMediaGetFullResponseDto } from '../dtos/response/care-record-media.full.response.dto';

export function CareRecordMediaAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record medias',
    }),
    DocRequest({
      queries: [...CareRecordMediaDocQueryCareRecord],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordMediaListResponseDto>(
      'care-record-media.list',
      {
        dto: CareRecordMediaListResponseDto,
      },
    ),
  );
}

export function CareRecordMediaAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record media',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordMediaCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordMediaGetResponseDto>('care-record-media.create', {
      dto: CareRecordMediaGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordMediaAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record media',
    }),
    DocRequest({
      params: CareRecordMediaDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordMediaUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-media.update'),
  );
}

export function CareRecordMediaAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record media',
    }),
    DocRequest({
      params: CareRecordMediaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.delete'),
  );
}

export function CareRecordMediaAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record media by id',
    }),
    DocRequest({
      params: CareRecordMediaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordMediaGetResponseDto>('care-record-media.getById', {
      dto: CareRecordMediaGetResponseDto,
    }),
  );
}

export function CareRecordMediaAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record media',
    }),
    DocRequest({
      params: CareRecordMediaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordMediaGetFullResponseDto>('care-record-media.get', {
      dto: CareRecordMediaGetFullResponseDto,
    }),
  );
}
