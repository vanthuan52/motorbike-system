import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  CareAreaDocParamsId,
  CareAreaDocQueryOrderBy,
  CareAreaDocQueryOrderDirection,
} from '../constants/care-area.doc.constant';
import { CareAreaDto } from '../dtos/care-area.dto';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { CareAreaCreateRequestDto } from '../dtos/request/care-area.create.request.dto';
import { CareAreaUpdateRequestDto } from '../dtos/request/care-area.update.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

export function CareAreaAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care area',
    }),
    DocRequest({
      queries: [...CareAreaDocQueryOrderBy, ...CareAreaDocQueryOrderDirection],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<CareAreaListResponseDto>('care-area.list', {
      dto: CareAreaListResponseDto,
    })
  );
}

export function CareAreaAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new care area',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: CareAreaCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('care-area.create', {
      dto: DatabaseIdDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function CareAreaAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'update a care area',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: CareAreaUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-area.update')
  );
}

export function CareAreaAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'delete a care area',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-area.delete')
  );
}

export function CareAreaAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a care area by id',
    }),
    DocRequest({
      params: CareAreaDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<CareAreaDto>('care-area.getById', {
      dto: CareAreaDto,
    })
  );
}

export function CareAreaWithServiceChecklistDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care areas with service checklists',
      description:
        'Get all care areas with their service checklists. Optionally filter service checklists by vehicle type.',
    }),
    DocRequest({
      queries: [
        {
          name: 'vehicleType',
          allowEmptyValue: true,
          required: false,
          type: 'string',
          enum: [
            'scooter',
            'manual_or_clutch',
            'manual',
            'clutch',
            'electric',
            'unknown',
          ],
          description:
            'Filter service checklists by vehicle type (xe tay ga: scooter, xe số/côn: manual_or_clutch)',
        },
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-area.listWithServiceChecklists')
  );
}
