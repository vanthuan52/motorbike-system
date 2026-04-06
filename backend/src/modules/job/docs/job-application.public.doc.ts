import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
} from '@/common/doc/decorators/doc.decorator';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { JobApplicationUserCreateRequestDto } from '../dtos/request/job-application.create.request.dto';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';

export function JobApplicationPublicCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'create a new jobApplication' }),
    DocRequest({
      queries: [],
      bodyType: EnumDocRequestBodyType.json,
      dto: JobApplicationUserCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<DatabaseIdDto>('job-application.create', {
      statusCode: HttpStatus.CREATED,
      dto: DatabaseIdDto,
    })
  );
}
