import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ServiceChecklistListResponseDto } from '../dtos/response/service-checklist.list.response.dto';

export function ServiceChecklistSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all service checklists',
    }),
    DocRequest({
      queries: [],
    }),
    DocResponsePaging<ServiceChecklistListResponseDto>(
      'service-checklist.list',
      {
        dto: ServiceChecklistListResponseDto,
      },
    ),
  );
}
