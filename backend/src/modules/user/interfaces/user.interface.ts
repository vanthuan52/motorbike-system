import {
  Device,
  DeviceOwnership,
  EnumUserLoginFrom,
  EnumUserLoginWith,
  EnumVerificationType,
  Role,
  User,
} from '@/generated/prisma-client';
import { UserModel } from '../models/user.model';

export interface IUser extends UserModel {
  roles: Role[];
}

export interface IUserProfile extends IUser {}

export interface IUserLogin {
  loginFrom: EnumUserLoginFrom;
  loginWith: EnumUserLoginWith;
  expiredAt: Date;
  jti: string;
  sessionId: string;
}

export interface IUserLoginResult {
  user: User;
  device: Device;
  deviceOwnership: DeviceOwnership;
  isNewDevice: boolean;
  sessionShouldBeInactive?: { id: string }[];
}

export interface IUserForgotPasswordCreate {
  expiredAt: Date;
  expiredInMinutes: number;
  resendInMinutes: number;
  reference: string;
  token: string;
  hashedToken: string;
  link: string;
  encryptedLink: string;
}

export interface IUserVerificationCreate {
  type: EnumVerificationType;
  expiredAt: Date;
  expiredInMinutes: number;
  resendInMinutes: number;
  reference: string;
  token: string;
  hashedToken: string;
  link?: string;
  encryptedLink?: string;
}

export type GeoLocation = {
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  city: string;
};

export type UserAgent = {
  ua: string;
  browser: UserAgentBrowser;
  cpu: UserAgentCpu;
  device: UserAgentDevice;
  engine: UserAgentEngine;
  os: UserAgentOs;
};

export type UserAgentBrowser = {
  name: string;
  version: string;
  major: string;
  type: string;
};

export type UserAgentCpu = {
  architecture: string;
};

export type UserAgentDevice = {
  type: string;
  vendor: string;
  model: string;
};

export type UserAgentEngine = {
  name: string;
  version: string;
};

export type UserAgentOs = {
  name: string;
  version: string;
};
