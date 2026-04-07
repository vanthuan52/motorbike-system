import { ApiTags } from '@nestjs/swagger';
import { JobApplicationService } from '../services/job-application.service';
import { ApplicationReviewService } from '../services/application-review.service';
import {
  ApplicationReviewAdminCreateDoc,
  ApplicationReviewAdminListDoc,
} from '../docs/application-review.admin.doc';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import { ApplicationReviewCreateRequestDto } from '../dtos/request/application-review.create.request.dto';
import { UserService } from '@/modules/user/services/user.service';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { ApplicationReviewUtil } from '../utils/application-review.util';
import { ApplicationReviewResponseDto } from '../dtos/application-review.response.dto';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { IApplicationReviewListFilters } from '../interfaces/application-review.filter.interface';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.job')
@Controller({
  version: '1',
  path: '/job/application-review',
})
export class ApplicationReviewAdminController {
  constructor(
    private readonly applicationReviewService: ApplicationReviewService,
    private readonly jobApplicationService: JobApplicationService,
    private readonly userService: UserService,
    private readonly applicationReviewUtil: ApplicationReviewUtil
  ) {}

  @ApplicationReviewAdminListDoc()
  @ResponsePaging('application-review.list')
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
      availableSearch: [],
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.ApplicationReviewSelect,
      Prisma.ApplicationReviewWhereInput
    >,
    @Query('job-application')
    jobApplicationId: string
  ): Promise<IResponsePagingReturn<ApplicationReviewResponseDto>> {
    const filters: IApplicationReviewListFilters = {};

    if (jobApplicationId) {
      const isJobApplicationExist =
        await this.jobApplicationService.findOneById(jobApplicationId);
      if (!isJobApplicationExist) {
        throw new NotFoundException(
          'application-review.error.notFoundJobApplication'
        );
      }
      filters.jobApplicationId = jobApplicationId;
    } else {
      throw new NotFoundException(
        'application-review.error.notFoundJobApplication'
      );
    }

    const result = await this.applicationReviewService.getListOffset(
      pagination,
      filters
    );

    const mapped = this.applicationReviewUtil.mapList(result.data);

    return {
      ...result,
      data: mapped,
    };
  }

  @ApplicationReviewAdminCreateDoc()
  @Response('application-review.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.jobApplication,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminApplicationReviewCreate)
  @Post('/create')
  async create(
    @Body() payload: ApplicationReviewCreateRequestDto
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const isJobApplicationExist = await this.jobApplicationService.findOneById(
      payload.jobApplication
    );
    if (!isJobApplicationExist) {
      throw new NotFoundException('job.error.notFoundJobApplication');
    }

    const isUserExist = await (this.userService as any).findOneById(payload.user);
    if (!isUserExist) {
      throw new NotFoundException('user.error.notFound');
    }

    const created = await this.applicationReviewService.create(payload);

    return { data: created };
  }
}
