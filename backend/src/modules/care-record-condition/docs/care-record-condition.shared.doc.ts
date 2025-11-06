import { applyDecorators, HttpStatus } from '@nestjs/common';

import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionGetResponseDto } from '../dtos/response/care-record-condition.get.response.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordConditionDocParamsId } from '../constants/care-record-condition.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { CareRecordConditionGetFullResponseDto } from '../dtos/response/care-record-condition.full.response.dto';

export function CareRecordConditionSharedCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record condition',
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordConditionCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordConditionGetResponseDto>(
      'care-record-condition.create',
      {
        dto: CareRecordConditionGetResponseDto,
        statusCode: HttpStatus.CREATED,
      },
    ),
  );
}

export function CareRecordConditionSharedUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record condition',
    }),
    DocRequest({
      params: CareRecordConditionDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: CareRecordConditionUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-condition.update'),
  );
}

export function CareRecordConditionSharedDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record condition',
    }),
    DocRequest({
      params: CareRecordConditionDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-condition.delete'),
  );
}

export function CareRecordConditionSharedParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care record condition by id',
    }),
    DocRequest({
      params: CareRecordConditionDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordConditionGetResponseDto>(
      'care-record-condition.getById',
      {
        dto: CareRecordConditionGetResponseDto,
      },
    ),
  );
}

export function CareRecordConditionSharedGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a care record condition',
    }),
    DocRequest({
      params: CareRecordConditionDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordConditionGetFullResponseDto>(
      'care-record-condition.get',
      {
        dto: CareRecordConditionGetFullResponseDto,
      },
    ),
  );
}
