import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationOffsetQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryOffsetParams } from '@/common/pagination/interfaces/pagination.interface';
import { RequestRequiredPipe } from '@/common/request/pipes/request.required.pipe';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ActivityLogAdminListDoc } from '../docs/activity-log.admin.doc';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import { ActivityLogService } from '../services/activity-log.service';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import { AuthJwtAccessProtected } from '@/modules/auth/decorators/auth.jwt.decorator';
import { PolicyAbilityProtected } from '@/modules/policy/decorators/policy.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
  EnumRoleType,
} from '@/modules/policy/enums/policy.enum';
import { RoleProtected } from '@/modules/role/decorators/role.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { RequestIsValidUuidPipe } from '@/common/request/pipes/request.is-valid-uuid.pipe';

@ApiTags('modules.admin.user.activityLog')
@Controller({
  version: '1',
  path: '/user/:userId/activity-log',
})
export class ActivityLogAdminController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ActivityLogAdminListDoc()
  @ResponsePaging('activityLog.list')
  @PolicyAbilityProtected(
    {
      subject: EnumPolicySubject.user,
      action: [EnumPolicyAction.read],
    },
    {
      subject: EnumPolicySubject.activityLog,
      action: [EnumPolicyAction.read],
    },
  )
  @RoleProtected(EnumRoleType.admin)
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationOffsetQuery()
    pagination: IPaginationQueryOffsetParams,
    @Param('userId', RequestRequiredPipe, RequestIsValidUuidPipe)
    userId: string,
  ): Promise<IResponsePagingReturn<ActivityLogDto>> {
    return this.activityLogService.getListOffset(userId, pagination);
  }
}
