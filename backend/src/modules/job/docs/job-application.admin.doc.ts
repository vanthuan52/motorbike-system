import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { applyDecorators } from '@nestjs/common';
import {
  JobApplicationDocQueryDate,
  JobApplicationDocQueryJobId,
  JobApplicationDocQueryStatus,
} from '../constants/job-application.doc.constants';
import { JobDocParamsId } from '../constants/job.doc.constants';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';
import { JobApplicationResponseDto } from '../dtos/job-application.response.dto';

export function JobApplicationAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all jobApplication',
    }),
    DocRequest({
      queries: [
        ...JobApplicationDocQueryStatus,
        ...JobApplicationDocQueryJobId,
        ...JobApplicationDocQueryDate,
      ],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<JobApplicationResponseDto>('job-application.list', {
      dto: JobApplicationResponseDto,
    })
  );
}

export function JobApplicationAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail an jobApplication' }),
    DocRequest({
      params: JobDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<JobApplicationResponseDto>('job-application.getById', {
      dto: JobApplicationResponseDto,
    })
  );
}

export function JobApplicationAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update status of jobApplication' }),
    DocRequest({
      params: JobDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('job-application.updateStatus')
  );
}
