import { HttpStatus, applyDecorators } from '@nestjs/common';

import { CareRecordServiceCreateRequestDto } from '../dtos/request/care-record-service.create.request.dto';
import { CareRecordServiceDto } from '../dtos/care-record-service.dto';
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
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareRecordServiceGetFullResponseDto } from '../dtos/response/care-record-service.full.response.dto';
import { CareRecordServiceUpdateStatusRequestDto } from '../dtos/request/care-record-service.update-status.request.dto';
import { CareRecordServiceWithChecklistsResponseDto } from '../dtos/response/care-record-service.with-checklists.response.dto';

export function CareRecordServiceAdminListDoc(): MethodDecorator {
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
      'care-record-service.list',
      {
        dto: CareRecordServiceListResponseDto,
      }
    )
  );
}

export function CareRecordServiceAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care record service',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordServiceCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareRecordServiceDto>('care-record-service.create', {
      dto: CareRecordServiceDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function CareRecordServiceAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordServiceUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-service.update')
  );
}

export function CareRecordServiceAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-service.delete')
  );
}

export function CareRecordServiceAdminParamsIdDoc(): MethodDecorator {
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
    DocResponse<CareRecordServiceDto>('care-record-service.getById', {
      dto: CareRecordServiceDto,
    })
  );
}

export function CareRecordServiceAdminGetDoc(): MethodDecorator {
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
      }
    )
  );
}

export function CareRecordServiceAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of a care record service',
    }),
    DocRequest({
      params: CareRecordServiceDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareRecordServiceUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-record-service.updateStatus')
  );
}

export function CareRecordServiceAdminListWithChecklistsDoc(): MethodDecorator {
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
      }
    )
  );
}
