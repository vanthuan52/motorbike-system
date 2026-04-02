import { ActivityLogModel } from '../models/activity-log.model';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { UserMapper } from '@/modules/user/mappers/user.mapper';

export class ActivityLogMapper {
  static toDomain(prismaLog: any): ActivityLogModel {
    const model = new ActivityLogModel();
    model.id = prismaLog.id;
    const actionMap: Record<string, EnumActivityLogAction> = {
      USER_LOGIN_CREDENTIAL: EnumActivityLogAction.userLoginCredential,
      USER_LOGIN_GOOGLE: EnumActivityLogAction.userLoginGoogle,
      USER_LOGIN_APPLE: EnumActivityLogAction.userLoginApple,
      USER_LOGOUT: EnumActivityLogAction.userLogout,
      USER_REFRESH_TOKEN: EnumActivityLogAction.userRefreshToken,
      USER_CHANGE_PASSWORD: EnumActivityLogAction.userChangePassword,
      USER_UPDATE_PROFILE: EnumActivityLogAction.userUpdateProfile,
      USER_FORGOT_PASSWORD: EnumActivityLogAction.userForgotPassword,
      USER_RESET_PASSWORD: EnumActivityLogAction.userResetPassword,
      USER_VERIFY_EMAIL: EnumActivityLogAction.userVerifyEmail,
    };
    model.ipAddress = prismaLog.ipAddress;
    model.userAgent = prismaLog.userAgent;
    model.metadata = prismaLog.metadata;
    model.userId = prismaLog.userId;

    model.createdAt = prismaLog.createdAt;
    model.updatedAt = prismaLog.updatedAt;
    model.deletedAt = prismaLog.deletedAt;
    model.createdBy = prismaLog.createdBy;
    model.updatedBy = prismaLog.updatedBy;
    model.deletedBy = prismaLog.deletedBy;

    if (prismaLog.user) {
      model.user = UserMapper.toDomain(prismaLog.user);
    }

    return model;
  }
}
