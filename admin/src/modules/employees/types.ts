import { UserType } from "@/types/user";

export interface EmployeeType extends UserType {
  employee_code: string | null;
  position: string | null;
  start_date: string | null;
  role: "TECHNICIAN" | "MANAGER" | "MODERATOR" | "ADMIN" | null;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}