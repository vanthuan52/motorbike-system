import { UserType } from "@/types/user";

export interface EmployeeType extends UserType {
  employee_code: string | null;
  position: string | null;
  start_date: string | null;
  role: "TECHNICIAN" | "MANAGER" | "MODERATOR" | "ADMIN" | null;
}
