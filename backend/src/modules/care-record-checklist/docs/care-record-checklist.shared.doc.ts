import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordChecklistCreateRequestDto } from '../dtos/request/care-record-checklist.create.request.dto';
import { CareRecordChecklistGetResponseDto } from '../dtos/response/care-record-checklist.get.response.dto';
import { CareRecordChecklistListResponseDto } from '../dtos/response/care-record-checklist.list.response.dto';
import { CareRecordChecklistUpdateRequestDto } from '../dtos/request/care-record-checklist.update.request.dto';
import {
  CareRecordChecklistDocParamsId,
  CareRecordChecklistDocQueryCareRecord,
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
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordChecklistGetFullResponseDto } from '../dtos/response/care-record-checklist.full.response.dto';
import { CareRecordChecklistUpdateStatusRequestDto } from '../dtos/request/care-record-checklist.update-status.request.dto';
import { CareRecordChecklistUpdateWearPercentageRequestDto } from '../dtos/request/care-record-checklist.update-wear-percentage.request.dto';
import { CareRecordChecklistUpdateNoteRequestDto } from '../dtos/request/care-record-checklist.update-note.request.dto';

export function CareRecordChecklistSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care record checklist',
    }),
    DocRequest({
      queries: [
        ...CareRecordChecklistDocQueryCareRecord,
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

export function CareRecordChecklistSharedCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record checklist',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordChecklistCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordChecklistGetResponseDto>(
      'care-record-checklist.create',
      {
        dto: CareRecordChecklistGetResponseDto,
        statusCode: HttpStatus.CREATED,
      },
    ),
  );
}

export function CareRecordChecklistSharedUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordChecklistUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.update'),
  );
}

export function CareRecordChecklistSharedDeleteDoc(): MethodDecorator {
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

export function CareRecordChecklistSharedParamsIdDoc(): MethodDecorator {
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
    DocResponse<CareRecordChecklistGetResponseDto>(
      'care-record-checklist.getById',
      {
        dto: CareRecordChecklistGetResponseDto,
      },
    ),
  );
}

export function CareRecordChecklistSharedGetDoc(): MethodDecorator {
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

export function CareRecordChecklistSharedUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record checklist',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordChecklistUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-checklist.updateStatus'),
  );
}

export function CareRecordChecklistSharedUpdateNoteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update note',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordChecklistUpdateNoteRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateNote'),
  );
}

export function CareRecordChecklistSharedUpdateWearPercentageDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update wear percentage',
    }),
    DocRequest({
      params: CareRecordChecklistDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordChecklistUpdateWearPercentageRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record.updateWearPercentage'),
  );
}
