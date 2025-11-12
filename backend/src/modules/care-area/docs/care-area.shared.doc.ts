import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { CareAreaListResponseDto } from '../dtos/response/care-area.list.response.dto';
import { CareAreaDocParamsId } from '../constants/care-area.doc.constant';
import { CareAreaGetResponseDto } from '../dtos/response/care-area.get.response.dto';
import { CareAreaWithServiceChecklistResponseDto } from '../dtos/response/care-area.with-service-checklist.response.dto';

export function CareAreaSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care areas',
    }),
    DocRequest({
      queries: [],
    }),
    DocResponsePaging<CareAreaListResponseDto>('care-area.list', {
      dto: CareAreaListResponseDto,
    }),
  );
}

export function CareAreaSharedParamsIdDoc(): MethodDecorator {
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
    DocResponse<CareAreaGetResponseDto>('care-area.getById', {
      dto: CareAreaGetResponseDto,
    }),
  );
}

export function CareAreaSharedWithServiceChecklistDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all care areas with service checklists',
      description: 'Get all care areas with their service checklists. Optionally filter service checklists by vehicle type.',
    }),
    DocRequest({
      queries: [
        {
          name: 'vehicleType',
          allowEmptyValue: true,
          required: false,
          type: 'string',
          enum: ['scooter', 'manual_or_clutch', 'manual', 'clutch', 'electric', 'unknown'],
          description: 'Filter service checklists by vehicle type (xe tay ga: scooter, xe số/côn: manual_or_clutch)',
        },
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('care-area.listWithServiceChecklists'),
  );
}
