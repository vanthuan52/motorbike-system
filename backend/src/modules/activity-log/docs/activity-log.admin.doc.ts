import { applyDecorators } from '@nestjs/common';
import {
  Doc,
  DocAuth,
  DocGuard,
  DocRequest,
  DocResponsePaging,
} from '@/common/doc/decorators/doc.decorator';
import { ActivityLogDto } from '../dtos/activity-log.dto';
import { UserDocParamsId } from '@/modules/user/constants/user.doc.constant';

export function ActivityLogAdminListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get all activity logs',
    }),
    DocRequest({
      params: UserDocParamsId,
    }),
    DocAuth({
      xApiKey: true,
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<ActivityLogDto>('activityLog.list', {
      dto: ActivityLogDto,
    }),
  );
}
