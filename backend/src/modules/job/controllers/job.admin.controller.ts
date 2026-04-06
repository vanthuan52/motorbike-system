import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobCreateRequestDto } from '../dtos/request/job.create.request.dto';
import { JobUpdateRequestDto } from '../dtos/request/job.update.request.dto';
import { JobUpdateStatusRequestDto } from '../dtos/request/job.update-status.request.dto';
import {
  Response,
  ResponsePaging,
} from '@/common/response/decorators/response.decorator';
import {
  IResponsePagingReturn,
  IResponseReturn,
} from '@/common/response/interfaces/response.interface';
import {
  JobAdminCreateDoc,
  JobAdminDeleteDoc,
  JobAdminListDoc,
  JobAdminParamsIdDoc,
  JobAdminUpdateDoc,
  JobAdminUpdateStatusDoc,
} from '../docs/job.admin.doc';
import { JobService } from '../services/job.service';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import {
  PaginationOffsetQuery,
  PaginationQueryFilterInEnum,
} from '@/common/pagination/decorators/pagination.decorator';
import {
  IPaginationIn,
  IPaginationQueryOffsetParams,
} from '@/common/pagination/interfaces/pagination.interface';
import { DatabaseIdDto } from '@/common/database/dtos/database.id.dto';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { JobUtil } from '../utils/job.util';
import { JobResponseDto } from '../dtos/job.response.dto';
import { ActivityLog } from '@/modules/activity-log/decorators/activity-log.decorator';
import { EnumActivityLogAction } from '@/modules/activity-log/enums/activity-log.enum';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { RequestIsValidObjectIdPipe } from '@/common/request/pipes/request.is-valid-object-id.pipe';
import {
  GeoLocation,
  UserAgent,
} from '@/modules/user/interfaces/user.interface';
import {
  RequestGeoLocation,
  RequestIPAddress,
  RequestUserAgent,
} from '@/common/request/decorators/request.decorator';
import {
  JobDefaultAvailableSearch,
  JobDefaultStatus,
} from '../constants/job.constant';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.admin.job')
@Controller({
  version: '1',
  path: '/job',
})
export class JobAdminController {
  constructor(
    private readonly jobService: JobService,
    private readonly jobUtil: JobUtil
  ) {}

  @JobAdminListDoc()
  @ResponsePaging('job.list')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
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
    status?: Record<string, IPaginationIn>
  ): Promise<IResponsePagingReturn<JobResponseDto>> {
    const result = await this.jobService.getListOffset(pagination, {
      ...status,
    });
    const mapped = this.jobUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @JobAdminParamsIdDoc()
  @Response('job.get')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/get/:jobId')
  async get(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string
  ): Promise<IResponseReturn<JobResponseDto>> {
    const job = await this.jobService.findOneById(jobId);
    const mapped = this.jobUtil.mapOne(job);
    return { data: mapped };
  }

  @JobAdminCreateDoc()
  @Response('job.create')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.create],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminJobCreate)
  @Post('/create')
  async create(
    @Body() body: JobCreateRequestDto,
    @AuthJwtPayload('userId') createdBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<DatabaseIdDto>> {
    const created = await this.jobService.create(
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      createdBy
    );
    return { data: created };
  }

  @JobAdminUpdateDoc()
  @Response('job.update')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminJobUpdate)
  @Put('/update/:jobId')
  async update(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string,
    @Body() body: JobUpdateRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.jobService.update(
      jobId,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  @JobAdminDeleteDoc()
  @Response('job.delete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminJobDelete)
  @Delete('/delete/:jobId')
  async delete(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.jobService.delete(
      jobId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {};
  }

  @JobAdminUpdateStatusDoc()
  @Response('job.updateStatus')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ActivityLog(EnumActivityLogAction.adminJobUpdateStatus)
  @Patch('/update/:jobId/status')
  async updateStatus(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string,
    @Body() body: JobUpdateStatusRequestDto,
    @AuthJwtPayload('userId') updatedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.jobService.updateStatus(
      jobId,
      body,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      updatedBy
    );
    return {};
  }

  // === Trash/Restore ===

  @ResponsePaging('job.trashList')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.read],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Get('/trash')
  async trashList(
    @PaginationOffsetQuery({
      availableSearch: JobDefaultAvailableSearch,
    })
    pagination: IPaginationQueryOffsetParams<
      Prisma.JobSelect,
      Prisma.JobWhereInput
    >
  ): Promise<IResponsePagingReturn<JobResponseDto>> {
    const result = await this.jobService.getTrashList(pagination);
    const mapped = this.jobUtil.mapList(result.data);
    return {
      ...result,
      data: mapped,
    };
  }

  @Response('job.restore')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.update],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Post('/restore/:jobId')
  async restore(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string,
    @AuthJwtPayload('userId') restoredBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.jobService.restore(
      jobId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      restoredBy
    );
    return {};
  }

  @Response('job.forceDelete')
  @PolicyAbilityProtected({
    subject: EnumPolicySubject.job,
    action: [EnumPolicyAction.delete],
  })
  @RoleProtected('admin')
  @UserProtected()
  @AuthJwtAccessProtected()
  @Delete('/force-delete/:jobId')
  async forceDelete(
    @Param('jobId', RequestRequiredPipe, RequestIsValidObjectIdPipe)
    jobId: string,
    @AuthJwtPayload('userId') deletedBy: string,
    @RequestIPAddress() ipAddress: string,
    @RequestUserAgent() userAgent: UserAgent,
    @RequestGeoLocation() geoLocation: GeoLocation | null
  ): Promise<IResponseReturn<void>> {
    await this.jobService.forceDelete(
      jobId,
      {
        ipAddress,
        userAgent,
        geoLocation,
      },
      deletedBy
    );
    return {};
  }
}
