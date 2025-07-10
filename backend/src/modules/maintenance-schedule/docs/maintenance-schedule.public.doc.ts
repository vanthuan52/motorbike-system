import { DatabaseIdResponseDto } from '@/common/database/dtos/response/database.id.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@/common/doc/enums/doc.enum';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { MaintenanceScheduleListResponseDto } from '../dtos/response/maintenance-schedule.list.response.dto';
import { MaintenanceScheduleCreateRequestPublicDto } from '../dtos/request/maintenance-schedule.create.request.public.dto';
export function MaintenanceSchedulePublicCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create maintenance schedule',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: MaintenanceScheduleCreateRequestPublicDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('maintenance-schedule.create', {
      dto: MaintenanceScheduleListResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}
