import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationCursorQuery } from '@/common/pagination/decorators/pagination.decorator';
import { IPaginationQueryCursorParams } from '@/common/pagination/interfaces/pagination.interface';
import { ResponsePaging } from '@/common/response/decorators/response.decorator';
import { IResponsePagingReturn } from '@/common/response/interfaces/response.interface';
import { ActivityLogSharedListDoc } from '../docs/activity-log.shared.doc';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import { ActivityLogService } from '../services/activity-log.service';
import { ApiKeyProtected } from '@/modules/api-key/decorators/api-key.decorator';
import {
  AuthJwtAccessProtected,
  AuthJwtPayload,
} from '@/modules/auth/decorators/auth.jwt.decorator';
import { UserProtected } from '@/modules/user/decorators/user.decorator';

@ApiTags('modules.shared.user.activityLog')
@Controller({
  version: '1',
  path: '/user/activity-log',
})
export class ActivityLogSharedController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ActivityLogSharedListDoc()
  @ResponsePaging('activityLog.list')
  @UserProtected()
  @AuthJwtAccessProtected()
  @ApiKeyProtected()
  @Get('/list')
  async list(
    @PaginationCursorQuery()
    pagination: IPaginationQueryCursorParams,
    @AuthJwtPayload('userId') userId: string,
  ): Promise<IResponsePagingReturn<ActivityLogDto>> {
    return this.activityLogService.getListCursor(userId, pagination);
  }
}
