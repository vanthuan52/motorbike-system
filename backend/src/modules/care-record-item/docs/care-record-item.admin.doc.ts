import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordItemCreateRequestDto } from '../dtos/request/care-record-item.create.request.dto';
import { CareRecordItemDto } from '../dtos/care-record-item.dto';
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
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareRecordItemGetFullResponseDto } from '../dtos/response/care-record-item.full.response.dto';
import { CareRecordItemUpdateApprovalRequestDto } from '../dtos/request/care-record-item.update-approval.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';

export function CareRecordItemAdminListDoc(): MethodDecorator {
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

export function CareRecordItemCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record item',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordItemCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('care-record-item.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordItemUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record item',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordItemUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-item.update'),
  );
}

export function CareRecordItemDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record item',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-item.delete'),
  );
}

export function CareRecordItemParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record item by id',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordItemDto>('care-record-item.getById', {
      dto: CareRecordItemDto,
    }),
  );
}

export function CareRecordItemGetDoc(): MethodDecorator {
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

export function CareRecordItemUpdateApprovalDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record checklist',
    }),
    DocRequest({
      params: CareRecordItemDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordItemUpdateApprovalRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-item.updateApproval'),
  );
}
