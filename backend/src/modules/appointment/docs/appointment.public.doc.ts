import { DatabaseIdDto } from '@/common/database/dtos/database.id.response.dto';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { AppointmentListResponseDto } from '../dtos/response/appointment.list.response.dto';
import { AppointmentBookRequestDto } from '../dtos/request/appointment.book.request.dto';
export function AppointmentsPublicCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'book an appointment',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: AppointmentBookRequestDto,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('appointment.create', {
      dto: AppointmentListResponseDto,
      statusCode: HttpStatus.CREATED,
    }),
  );
}
