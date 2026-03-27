import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationCursorQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ActivityLogSharedListDoc } from '@/modules/activity-log/docs/activity-log.shared.doc';
import { ActivityLogResponseDto } from '@/modules/activity-log/dtos/response/activity-log.response.dto';
import { ActivityLogService } from '@/modules/activity-log/services/activity-log.service';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';
import { ActivityLogUtil } from '../utils/activity-log.util';
import { Prisma } from '@/generated/prisma-client';

@ApiTags('modules.shared.user.activityLog')
@Controller({
  version: '1',
  path: '/user/activity-log',
})
export class ActivityLogSharedController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly activityLogUtil: ActivityLogUtil
  ) {}

  @ActivityLogSharedListDoc()
  @ResponsePaging('activityLog.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationCursorQuery()
    pagination: IPaginationQueryCursorParams<
      Prisma.ActivityLogSelect,
      Prisma.ActivityLogWhereInput
    >,
    @AuthJwtPayload('userId') userId: string
  ): Promise<IResponsePagingReturn<ActivityLogResponseDto>> {
    const result = await this.activityLogService.getListCursor(pagination, {
      userId,
    });
    return {
      ...result,
      data: this.activityLogUtil.mapList(result.data),
    };
  }
}
