import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistDto } from '../dtos/care-record-checklist.dto';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  CareRecordChecklistDocParamsId,
  CareRecordChecklistDocQueryCareRecordService,
  CareRecordChecklistDocQueryStatus,
} from '../constants/care-record-checklist.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';
import { CareRecordChecklistUpdateResultRequestDto } from '../dtos/request/care-record-checklist.update-result.request.dto';

export function CareRecordChecklistListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record checklist',
    }),
    DocRequest({
      queries: [
        ...CareRecordChecklistDocQueryCareRecordService,
        ...CareRecordChecklistDocQueryStatus,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareRecordChecklistListResponseDto>(
      'care-record-checklist.list',
      {
        dto: CareRecordChecklistListResponseDto,
      },
    ),
  );
}

export function CareRecordChecklistCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record checklist',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordChecklistDto>('care-record-checklist.create', {
      dto: CareRecordChecklistDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}

export function CareRecordChecklistUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.update'),
  );
}

export function CareRecordChecklistDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.delete'),
  );
}

export function CareRecordChecklistParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record checklist by id',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordChecklistDto>('care-record-checklist.getById', {
      dto: CareRecordChecklistDto,
    }),
  );
}

export function CareRecordChecklistGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordChecklistGetFullResponseDto>(
      'care-record-checklist.get',
      {
        dto: CareRecordChecklistGetFullResponseDto,
      },
    ),
  );
}

export function CareRecordChecklistUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.updateStatus'),
  );
}

export function CareRecordChecklistUpdateResultDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update result status of a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistUpdateResultRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.updateResultStatus'),
  );
}

export function CareRecordChecklistUpdateNoteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update note',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistUpdateNoteRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateNote'),
  );
}

export function CareRecordChecklistUpdateWearPercentageDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update wear percentage',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordChecklistUpdateWearPercentageRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateWearPercentage'),
  );
}
