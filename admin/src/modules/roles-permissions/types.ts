export type Permission =
  // Nhân viên
  | "employee:view"
  | "employee:create"
  | "employee:update"
  | "employee:delete"
  // Bài viết
  | "post:view"
  | "post:create"
  | "post:update"
  | "post:delete"
  // Tin nhắn
  | "message:view"
  | "message:create"
  | "message:update"
  | "message:delete"
  // Hãng xe
  | "vehicle-company:view"
  | "vehicle-company:create"
  | "vehicle-company:update"
  | "vehicle-company:delete"
  // Loại xe
  | "vehicle-type:view"
  | "vehicle-type:create"
  | "vehicle-type:update"
  | "vehicle-type:delete"
  // Phụ tùng
  | "vehicle-part:view"
  | "vehicle-part:create"
  | "vehicle-part:update"
  | "vehicle-part:delete"
  // Khách hàng
  | "customer:view"
  | "customer:create"
  | "customer:update"
  | "customer:delete"
  // Hóa đơn
  | "invoice:view"
  | "invoice:create"
  | "invoice:update"
  | "invoice:delete"
  // Vai trò & quyền
  | "role:view"
  | "role:create"
  | "role:update"
  | "role:delete"
  // Báo cáo (nếu có)
  | "report:view"
  // Cài đặt hệ thống (nếu có)
  | "setting:update"
  // lịch hẹn
  | "appointments:view"
  | "appointments:create"
  | "appointments:update"
  | "appointments:delete"
  // Bảo dưỡng
  | "maintenance:view"
  | "maintenance:update";

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
