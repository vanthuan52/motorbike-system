import { ApiResponse } from "@/types/api.type";

export type RoleType = "USER" | "TECHNICIAN" | "MANAGER" | "ADMIN";

export enum ENUM_AUTH_LOGIN_FROM {
  CREDENTIAL = "CREDENTIAL",
  SOCIAL_GOOGLE = "SOCIAL_GOOGLE",
  SOCIAL_APPLE = "SOCIAL_APPLE",
}

export enum ENUM_POLICY_ROLE_TYPE {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  TECHNICIAN = "TECHNICIAN",
  USER = "USER",
}

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthLoginResponseData {
  tokenType: "Bearer";
  roleType: RoleType;
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
}

export interface AuthRefreshTokenResponseData extends AuthLoginResponseData {}

export type AuthLoginResponse = ApiResponse<AuthLoginResponseData>;
export type AuthRefreshTokenResponse =
  ApiResponse<AuthRefreshTokenResponseData>;

export interface IAuthJwtAccessTokenPayload {
  loginDate: Date;
  loginFrom: ENUM_AUTH_LOGIN_FROM;
  user: string;
  email: string;
  session: string;
  role: string;
  type: ENUM_POLICY_ROLE_TYPE;
  iat?: number;
  nbf?: number;
  exp?: number;
  aud?: string;
  iss?: string;
  sub?: string;
}

export type IAuthJwtRefreshTokenPayload = Omit<
  IAuthJwtAccessTokenPayload,
  "role" | "type" | "email"
>;

export interface UserAuthInfo extends AuthLoginResponseData {}
