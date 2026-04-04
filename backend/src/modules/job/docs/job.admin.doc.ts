import { applyDecorators, HttpStatus } from '@nestjs/common';

import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponse,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { JobResponseDto } from '../dtos/job.response.dto';
import { JobCreateRequestDto } from '../dtos/request/job.create.request.dto';
import { JobUpdateRequestDto } from '../dtos/request/job.update.request.dto';
import { JobUpdateStatusRequestDto } from '../dtos/request/job.update-status.request.dto';
import {
  JobDocParamsId,
  JobDocQueryStatus,
} from '../constants/job.doc.constants';
import { EnumDocRequestBodyType } from '@/common/doc/enums/doc.enum';

export function JobAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all job',
    }),
    DocRequest({
      queries: [...JobDocQueryStatus],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<JobResponseDto>('job.list', {
      dto: JobResponseDto,
    })
  );
}

export function JobAdminCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'create a new job',
    }),
    DocRequest({
      bodyType: EnumDocRequestBodyType.json,
      dto: JobCreateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<JobResponseDto>('job.create', {
      dto: JobResponseDto,
      statusCode: HttpStatus.CREATED,
    })
  );
}

export function JobAdminUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update a job' }),
    DocRequest({
      params: JobDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: JobUpdateRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('job.update')
  );
}

export function JobAdminDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'delete a job' }),
    DocRequest({
      params: JobDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('job.delete')
  );
}

export function JobAdminUpdateStatusDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'update status of job' }),
    DocRequest({
      params: JobDocParamsId,
      bodyType: EnumDocRequestBodyType.json,
      dto: JobUpdateStatusRequestDto,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('job.updateStatus')
  );
}

export function JobAdminParamsIdDoc(): MethodDecorator {
  return applyDecorators(
    Doc({ summary: 'get detail an job' }),
    DocRequest({
      params: JobDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<JobResponseDto>('job.getById', {
      dto: JobResponseDto,
    })
  );
}
