import axios from "@/lib/axios";
import { mockUsers } from "../mocks/users";
import { LoginFormType } from "../schemas/auth-schema";
import { ApiResponse, LoginSuccessPayload } from "../types";
import { localStorageHelper } from "@/utils/local-storage-helper";

const MOCK_API = true;
const MOCK_DELAY = 1000;

const mockLogin = (
  dataLogin: LoginFormType
): Promise<ApiResponse<LoginSuccessPayload>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUser = mockUsers.find(
        (user) =>
          user.email === dataLogin.email && user.password === dataLogin.password
      );

      if (foundUser) {
        const access_token = `mock_token_${Date.now()}`;
        const expires_in = Math.floor(Date.now() / 1000) + 3600;

        localStorageHelper.setAuthToken(access_token, expires_in);

        const response: ApiResponse<LoginSuccessPayload> = {
          status: true,
          statusCode: 200,
          message: "Login Successful!",
          data: {
            access_token,
            expires_in,
          },
        };

        resolve(response);
      } else {
        const error: ApiResponse<null> = {
          status: false,
          statusCode: 401,
          message: "Invalid email or password",
          data: null,
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const mockGetCurrentUser = (): Promise<ApiResponse<any>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUser = mockUsers.find((user) => user.id === "user-1");

      if (foundUser) {
        const response: ApiResponse<any> = {
          status: true,
          statusCode: 200,
          message: "",
          data: {
            user: foundUser,
          },
        };

        resolve(response);
      } else {
        const error: ApiResponse<any> = {
          status: false,
          statusCode: 404,
          message: "User not found",
          data: {
            user: null,
          },
        };
        reject(error);
      }
    }, MOCK_DELAY);
  });
};

const login = async (
  dataLogin: LoginFormType
): Promise<ApiResponse<LoginSuccessPayload>> => {
  if (!dataLogin) return Promise.reject({ message: "Login data is required" });

  if (MOCK_API) {
    return mockLogin(dataLogin);
  } else {
    const response = await axios.post<ApiResponse<LoginSuccessPayload>>(
      "/auth/signin",
      dataLogin
    );
    return response.data;
  }
};

const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  const token = localStorageHelper.getAuthToken().accessToken;
  if (!token) throw new Error("No token found");

  if (MOCK_API) {
    return mockGetCurrentUser();
  }
  const response = await axios.get("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const authApi = {
  login,
  getCurrentUser,
};

export default authApi;
