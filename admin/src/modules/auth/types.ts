export interface LoginSuccessPayload {
  access_token: string;
  expires_in: number;
}

export type AuthenticatedUser = User & { role: UserRole };

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type UserRole = "USER" | "TECHNICIAN" | "MODERATOR" | "ADMIN";

export type BaseEntity = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type User = Omit<BaseEntity, "createdAt"> & {
  name: string;
  email: string;
  password: string;
};
