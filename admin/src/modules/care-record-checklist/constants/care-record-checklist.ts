import { ENUM_CARE_RECORD_CHECKLIST_STATUS } from "../types";

export const getStatusText = (
  status: ENUM_CARE_RECORD_CHECKLIST_STATUS
): string => {
  switch (status) {
    case ENUM_CARE_RECORD_CHECKLIST_STATUS.CHECKED:
      return "Đã kiểm tra";
    case ENUM_CARE_RECORD_CHECKLIST_STATUS.REPLACED:
      return "Đã thay thế";
    case ENUM_CARE_RECORD_CHECKLIST_STATUS.SKIPPED:
      return "Bỏ qua";
    case ENUM_CARE_RECORD_CHECKLIST_STATUS.UNCHECKED:
    default:
      return "Chưa kiểm tra";
  }
};
