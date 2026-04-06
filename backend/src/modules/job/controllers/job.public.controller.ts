import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { JobService } from '../services/job.service';
import { JobPublicListDoc, JobPublicParamsIdDoc } from '../docs/job.public.doc';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { JobUtil } from '../utils/job.util';
import { JobResponseDto } from '../dtos/job.response.dto';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import {
  JobDefaultAvailableSearch,
  JobDefaultJobType,
  JobDefaultStatus,
} from '../constants/job.constant';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.public.job')
@Controller({
  version: '1',
  path: '/job',
})
export class JobPublicController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobUtil: JobUtil
  ) {}

  @JobPublicParamsIdDoc()
  @Response('job.get')
  @HttpCode(HttpStatus.OK)
  @Get('/get/:slug')
  async get(
    @Param('slug', RequestRequiredPipe) slug: string
  ): Promise<IResponseReturn<JobResponseDto>> {
    const job = await this.jobService.findOneBySlug(slug);
    const mapped = this.jobUtil.mapOne(job);
    return { data: mapped };
  }

  @JobPublicListDoc()
  @ResponsePaging('job.list')
  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: JobDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >,
    @PaginationQueryFilterInEnum('status', JobDefaultStatus)
    status?: Record<string, IPaginationIn>,
    @PaginationQueryFilterInEnum('jobType', JobDefaultJobType)
    jobType?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<JobResponseDto>> {
    const result = await this.jobService.getListOffset(pagination, {
      ...status,
      ...jobType,
    });

    const mapped = this.jobUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }
}
