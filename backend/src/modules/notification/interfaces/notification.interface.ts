import { IRequestLog } from '@/common/request/interfaces/request.interface';
import {
  EnumUserLoginFrom,
  EnumUserLoginWith,
} from '@/modules/user/enums/user.enum';

export interface INotificationTemporaryPasswordPayload {
  password: string;
  passwordExpiredAt: string;
  passwordCreatedAt: string;
}

export type INotificationWelcomeByAdminPayload =
  INotificationTemporaryPasswordPayload;

export interface INotificationVerificationEmailPayload {
  link: string;
  expiredAt: string;
  expiredInMinutes: number;
  reference: string;
}

export type INotificationVerifiedEmailPayload = Pick<
  INotificationVerificationEmailPayload,
  'reference'
>;

export interface INotificationForgotPasswordPayload extends INotificationVerificationEmailPayload {
  resendInMinutes: number;
}

export interface INotificationVerifiedMobileNumberPayload extends INotificationVerifiedEmailPayload {
  resendInMinutes: number;
  mobileNumber: string;
}

export interface INotificationNewDeviceLoginPayload {
  loginFrom: EnumUserLoginFrom;
  loginWith: EnumUserLoginWith;
  loginAt: string;
  requestLog: IRequestLog;
}

export interface INotificationWorkerBulkPayload<T = unknown> {
  proceedBy: string;
  data?: T;
}

export interface INotificationWorkerPayload<
  T = unknown,
> extends INotificationWorkerBulkPayload<T> {
  userId: string;
}

// For push notification

export interface INotificationSendPushPayload {
  userId: string;
  notificationId: string;
  notificationTokens: string[];
  username: string;
}

export interface INotificationPushWorkerPayload<T = unknown> {
  send: INotificationSendPushPayload;
  data?: T;
}

export interface INotificationPushWorkerCleanupTokenPayload {
  data: {
    userId: string;
    failureTokens: string[];
  };
}

// For email notification
export interface INotificationEmailSendPayload {
  userId: string;
  notificationId: string;
  email: string;
  username: string;
  cc?: string[];
  bcc?: string[];
}

export interface INotificationEmailWorkerPayload<T = unknown> {
  send: INotificationEmailSendPayload;
  data?: T;
}

export interface INotificationEmailWorkerBulkPayload<T = unknown> {
  send: INotificationEmailSendPayload[];
  data?: T;
}

export type INotificationPublishTermPolicyPayload = any;
export type INotificationAcceptTermPolicyPayload = any;
