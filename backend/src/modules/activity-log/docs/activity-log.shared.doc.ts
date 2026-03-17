import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import { EnumPaginationType } from '@/common/pagination/enums/pagination.enum';

export function ActivityLogSharedListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all activity logs',
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({}),
    DocResponsePaging<ActivityLogDto>('activityLog.list', {
      dto: ActivityLogDto,
      type: EnumPaginationType.cursor,
    }),
  );
}
