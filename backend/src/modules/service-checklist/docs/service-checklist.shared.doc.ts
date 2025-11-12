import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';
import { ServiceChecklistDocParamsId } from '../constants/service-checklist.doc.constant';
import { ServiceChecklistGetResponseDto } from '../dtos/response/service-checklist.get.response.dto';

export function ServiceChecklistSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service checklists',
      description:
        'Get all service checklists with optional vehicle type filtering.',
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
    DocResponsePaging<ServiceChecklistListResponseDto>(
      'service-checklist.list',
      {
        dto: ServiceChecklistListResponseDto,
      },
    ),
  );
}

export function ServiceChecklistSharedParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get a service checklist by id',
    }),
    DocRequest({
      params: ServiceChecklistDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ServiceChecklistGetResponseDto>('service-checklist.getById', {
      dto: ServiceChecklistGetResponseDto,
    }),
  );
}
