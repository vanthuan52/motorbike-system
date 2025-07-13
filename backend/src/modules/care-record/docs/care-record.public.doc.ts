import { applyDecorators } from '@nestjs/common';

import { CareRecordListResponseDto } from '../dtos/response/care-record.list.response.dto';
import {
  CareRecordDocQueryOrderBy,
  CareRecordDocQueryOrderDirection,
  CareRecordDocQueryStatus,
  CareRecordDocQueryVehicleModel,
  CareRecordDocQueryVehicleService,
} from '../constants/care-record.doc.constant';
import {
  Doc,
  DocRequest,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';

export function CareRecordPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all CareRecord',
    }),
    DocRequest({
      queries: [
        ...CareRecordDocQueryVehicleModel,
        ...CareRecordDocQueryVehicleService,
        ...CareRecordDocQueryStatus,
        ...CareRecordDocQueryOrderBy,
        ...CareRecordDocQueryOrderDirection,
      ],
    }),
    DocResponsePaging<CareRecordListResponseDto>('CareRecord.list', {
      dto: CareRecordListResponseDto,
    }),
  );
}
