import { AxiosError } from "axios";
import { User } from "./types";
import { ApiErrorResponse } from "@/types/api.type";

const userService = {
  getProfile: async (): Promise<User> => {
    try {
      return {
        email: "ab",
        name: "ba",
        phone: "2",
      };
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(
        axiosError.response?.data.message || "An unexpected error."
      );
    }
  },
};

export default userService;
