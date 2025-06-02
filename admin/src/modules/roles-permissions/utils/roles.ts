import { permissionGroups } from "../constant/roles";
import { allPermissions } from "../mocks/role-permissions";

function getPermissionColor(permission: string) {
  const group = Object.keys(permissionGroups).find((key) =>
    permission.startsWith(key)
  );
  return group ? permissionGroups[group].color : "default";
}

function getPermissionGroup(permission: string) {
  return (
    Object.keys(permissionGroups).find((key) => permission.startsWith(key)) ||
    "other"
  );
}

function getPermissionLabel(permission: string) {
  return (
    allPermissions.find((p) => p.value === permission)?.label || permission
  );
}
const groupPermissions = () => {
  const groups: Record<
    string,
    { label: string; options: { value: string; label: string }[] }
  > = {};
  allPermissions.forEach((p) => {
    const [module] = p.value.split(":");
    if (!groups[module]) {
      groups[module] = {
        label: module
          .replace("employee", "Nhân viên")
          .replace("post", "Bài viết")
          .replace("message", "Tin nhắn")
          .replace("vehicle-company", "Hãng xe")
          .replace("vehicle-type", "Loại xe")
          .replace("vehicle-part", "Phụ tùng")
          .replace("customer", "Khách hàng")
          .replace("invoice", "Hoá đơn")
          .replace("role", "Phân quyền")
          .replace("report", "Báo cáo")
          .replace("setting", "Cài đặt")
          .replace("appointments", "Lịch hẹn")
          .replace("maintenance", "Bảo dưỡng"),
        options: [],
      };
    }
    groups[module].options.push({ value: p.value, label: p.label });
  });
  return Object.values(groups);
};
export {
  getPermissionColor,
  getPermissionGroup,
  getPermissionLabel,
  groupPermissions,
};
