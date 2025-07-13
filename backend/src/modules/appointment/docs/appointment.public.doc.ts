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
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentCreateRequestPublicDto } from '../dtos/request/appointment.create.request.public.dto';
export function AppointmentsPublicCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create maintenance schedule',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
      dto: AppointmentCreateRequestPublicDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdResponseDto>('appointment.create', {
      dto: AppointmentListResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}
