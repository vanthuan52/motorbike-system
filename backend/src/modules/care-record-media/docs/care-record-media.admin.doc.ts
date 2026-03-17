import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordMediaCreateRequestDto } from '../dtos/request/care-record-media.create.request.dto';
import { CareRecordMediaDto } from '../dtos/care-record-media.dto';
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
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
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
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordMediaCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordMediaDto>('care-record-media.create', {
      dto: CareRecordMediaDto,
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
      bodyType: EnumDocRequestBodyType.json,
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
    DocResponse<CareRecordMediaDto>('care-record-media.getById', {
      dto: CareRecordMediaDto,
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
