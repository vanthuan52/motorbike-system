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
import { PaginationUtil } from '@/common/pagination/utils/pagination.util';
import { Prisma } from '@generated/prisma-client';

@ApiTags('modules.shared.user.activityLog')
@Controller({
  version: '1',
  path: '/user/activity-log',
})
export class ActivityLogSharedController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly paginationUtil: PaginationUtil,
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
    const { data, total } = await this.activityLogService.getListCursor(
      userId,
      pagination
    );
    const mapped = this.activityLogUtil.mapList(data);
    return this.paginationUtil.formatCursor(mapped, total, pagination);
  }
}
