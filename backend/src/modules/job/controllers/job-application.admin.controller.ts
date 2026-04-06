import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  JobApplicationAdminListDoc,
  JobApplicationAdminParamsIdDoc,
  JobApplicationAdminUpdateStatusDoc,
} from '../docs/job-application.admin.doc';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { JobApplicationResponseDto } from '../dtos/job-application.response.dto';
import { JobApplicationService } from '../services/job-application.service';
import { JobApplicationUpdateStatusRequestDto } from '../dtos/request/job-application.update-status.request.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { JobApplicationUtil } from '../utils/job-application.util';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { IJobApplicationListFilters } from '../interfaces/job-application.filter.interface';
import { JobApplicationDefaultStatus } from '../constants/job.constant';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.job')
@Controller({
  version: '1',
  path: '/job/job-application',
})
export class JobApplicationAdminController {
  constructor(
    private readonly jobApplicationService: JobApplicationService,
    private readonly jobApplicationUtil: JobApplicationUtil
  ) {}

  @JobApplicationAdminListDoc()
  @ResponsePaging('job-application.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.jobApplication,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery({
      availableSearch: ['name', 'status'],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobApplicationSelect,
      Prisma.JobApplicationWhereInput
    >,
    @PaginationQueryFilterInEnum('status', JobApplicationDefaultStatus)
    status: Record<string, IPaginationIn>,
    @Query('jobId') jobId: string,
    @Query('appliedAtFrom') appliedAtFrom: string,
    @Query('appliedAtTo') appliedAtTo: string
  ): Promise<IResponsePagingReturn<JobApplicationResponseDto>> {
    const filters: IJobApplicationListFilters = {
      ...status,
    };
    if (jobId) {
      filters.jobId = jobId;
    }
    if (appliedAtFrom && appliedAtTo) {
      filters.appliedAt = {
        gte: new Date(appliedAtFrom),
        lte: new Date(appliedAtTo),
      };
    } else if (appliedAtFrom) {
      filters.appliedAt = { gte: new Date(appliedAtFrom) };
    } else if (appliedAtTo) {
      filters.appliedAt = { lte: new Date(appliedAtTo) };
    }

    const result = await this.jobApplicationService.getListOffset(
      pagination,
      filters
    );

    const mapped = this.jobApplicationUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }

  @JobApplicationAdminParamsIdDoc()
  @Response('job-application.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.jobApplication,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:id')
  async get(
    @Param('id') id: string
  ): Promise<IResponseReturn<JobApplicationResponseDto>> {
    const jobApplication = await this.jobApplicationService.findOneById(id);
    if (!jobApplication) {
      throw new NotFoundException({
        message: 'jobApplication.error.notFound',
      });
    }
    const mapped = this.jobApplicationUtil.mapOne(jobApplication);
    return { data: mapped };
  }

  @JobApplicationAdminUpdateStatusDoc()
  @Response('job-application.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.jobApplication,
    action: [EnumPolicyAction.read, EnumPolicyAction.update],
  })
  @RoleProtected('admin', 'user')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminJobApplicationUpdateStatus)
  @Patch('/update/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() payload: JobApplicationUpdateStatusRequestDto
  ): Promise<IResponseReturn<void>> {
    await this.jobApplicationService.updateStatus(id, payload);
    return {
      metadata: {
        messageProperties: {
          status: payload.status.toLowerCase(),
        },
      },
    };
  }
}
