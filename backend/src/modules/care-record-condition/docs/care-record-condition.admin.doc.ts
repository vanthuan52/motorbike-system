import { HttpStatus, applyDecorators } from '@nestjs/common';

import { CareRecordConditionCreateRequestDto } from '../dtos/request/care-record-condition.create.request.dto';
import { CareRecordConditionDto } from '../dtos/care-record-condition.dto';
import { CareRecordConditionUpdateRequestDto } from '../dtos/request/care-record-condition.update.request.dto';
import { CareRecordConditionDocParamsId } from '../constants/care-record-condition.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareRecordConditionGetFullResponseDto } from '../dtos/response/care-record-condition.full.response.dto';

export function CareRecordConditionAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record condition',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordConditionCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordConditionDto>('care-record-condition.create', {
      dto: CareRecordConditionDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function CareRecordConditionAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record condition',
    }),
    DocRequest({
      params: CareRecordConditionDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordConditionUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-condition.update')
  );
}

export function CareRecordConditionAdminDeleteDoc(): MethodDecorator {
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
    DocResponse('care-record-condition.delete')
  );
}

export function CareRecordConditionAdminParamsIdDoc(): MethodDecorator {
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
    DocResponse<CareRecordConditionDto>('care-record-condition.getById', {
      dto: CareRecordConditionDto,
    })
  );
}

export function CareRecordConditionAdminGetDoc(): MethodDecorator {
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
      }
    )
  );
}
