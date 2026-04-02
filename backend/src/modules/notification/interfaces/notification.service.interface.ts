import {
  IPaginationQueryCursorParams,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { IRequestLog } from '@/common/request/interfaces/request.interface';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { NotificationUserSettingRequestDto } from '@/modules/notification/dtos/request/notification.user-setting.request.dto';
import { NotificationResponseDto } from '@/modules/notification/dtos/response/notification.response.dto';
import { NotificationUserSettingResponseDto } from '@/modules/notification/dtos/response/notification.user-setting.response.dto';
import { Prisma } from '@/generated/prisma-client';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';

export interface INotificationService {
  getListCursor(
    userId: string,
    pagination: IPaginationQueryCursorParams<
      Prisma.NotificationSelect,
      Prisma.NotificationWhereInput
    >
  ): Promise<IPaginationCursorReturn<Prisma.NotificationGetPayload<{}>>>;
  getListUserSetting(
    userId: string
  ): Promise<IResponseReturn<NotificationUserSettingResponseDto>>;
  markAsRead(
    userId: string,
    notificationId: string
  ): Promise<IResponseReturn<void>>;
  markAllAsRead(userId: string): Promise<IResponseReturn<void>>;
  updateUserSetting(
    userId: string,
    data: NotificationUserSettingRequestDto,
    requestLog: IRequestLog
  ): Promise<IResponseReturn<void>>;
  initUserSetting(userId: string, options?: IDatabaseOptions): Promise<void>;
}
