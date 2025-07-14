import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemGetResponseDto } from '../dtos/response/care-record-item.get.response.dto';
import { CareRecordItemListResponseDto } from '../dtos/response/care-record-item.list.response.dto';
import { CareRecordItemUpdateRequestDto } from '../dtos/request/care-record-item.update.request.dto';
import {
  CareRecordItemDocParamsId,
  CareRecordItemDocQueryCareRecord,
} from '../constants/care-record-item.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';

export function CareRecordItemSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record items',
    }),
    DocRequest({
      queries: [...CareRecordItemDocQueryCareRecord],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordItemListResponseDto>('care-record-item.list', {
      dto: CareRecordItemListResponseDto,
    }),
  );
}

export function CareRecordItemSharedCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record items',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordItemCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordItemGetResponseDto>('care-record-checklist.create', {
      dto: CareRecordItemGetResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordItemSharedUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record checklist',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordItemUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.update'),
  );
}

export function CareRecordItemSharedDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record checklist',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.delete'),
  );
}

export function CareRecordItemSharedParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record checklist by id',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordItemGetResponseDto>('care-record-checklist.getById', {
      dto: CareRecordItemGetResponseDto,
    }),
  );
}

export function CareRecordItemSharedGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record checklist',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordItemGetFullResponseDto>('care-record-checklist.get', {
      dto: CareRecordItemGetFullResponseDto,
    }),
  );
}

export function CareRecordItemSharedUpdateApprovalDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'khách hàng có đồng ý hay không',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordItemUpdateApprovalRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-item.updateApproval'),
  );
}
