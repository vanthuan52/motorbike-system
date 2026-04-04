import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { JobResponseDto } from '../dtos/job.response.dto';
import {
  JobDocParamsId,
  JobDocQueryStatus,
} from '../constants/job.doc.constants';

export function JobPublicListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all job (public)',
    }),
    DocRequest({
      queries: [...JobDocQueryStatus],
    }),
    DocResponsePaging<JobResponseDto>('job.public.list', {
      dto: JobResponseDto,
    })
  );
}

export function JobPublicParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail a job (public)' }),
    DocRequest({
      params: JobDocParamsId,
    }),
    DocResponse<JobResponseDto>('job.public.getById', {
      dto: JobResponseDto,
    })
  );
}
