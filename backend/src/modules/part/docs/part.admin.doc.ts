import { HttpStatus, applyDecorators } from '@nestjs/common';

import { PartCreateRequestDto } from '../dtos/request/part.create.request.dto';
import { PartDto } from '../dtos/part.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { PartListResponseDto } from '../dtos/response/part.list.response.dto';
import { PartUpdateRequestDto } from '../dtos/request/part.update.request.dto';
import { PartUpdateStatusRequestDto } from '../dtos/request/part.update-status.request.dto';
import {
  PartDocParamsId,
  PartDocQueryOrderBy,
  PartDocQueryOrderDirection,
  PartDocQueryPartType,
  PartDocQueryStatus,
  PartDocQueryVehicleBrand,
} from '../constants/part.doc.constant';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { PartGetFullResponseDto } from '../dtos/response/part.full.response.dto';

export function PartAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all part',
    }),
    DocRequest({
      queries: [
        ...PartDocQueryVehicleBrand,
        ...PartDocQueryPartType,
        ...PartDocQueryStatus,
        ...PartDocQueryOrderBy,
        ...PartDocQueryOrderDirection,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<PartListResponseDto>('part.list', {
      dto: PartListResponseDto,
    })
  );
}

export function PartAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new part',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: PartCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('part.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function PartAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a part',
    }),
    DocRequest({
      params: PartDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: PartUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part.update')
  );
}

export function PartAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a part',
    }),
    DocRequest({
      params: PartDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part.delete')
  );
}

export function PartAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update status of part',
    }),
    DocRequest({
      params: PartDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: PartUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('part.updateStatus')
  );
}

export function PartAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a part by id',
    }),
    DocRequest({
      params: PartDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PartDto>('part.getById', {
      dto: PartDto,
    })
  );
}

export function PartAdminGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail a part',
    }),
    DocRequest({
      params: PartDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<PartGetFullResponseDto>('part.get', {
      dto: PartGetFullResponseDto,
    })
  );
}
