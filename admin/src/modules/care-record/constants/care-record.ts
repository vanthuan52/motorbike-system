import { ENUM_CARE_RECORD_STATUS } from "../types";

const statusColors: Record<ENUM_CARE_RECORD_STATUS, string> = {
  pending: "orange",
  in_progress: "blue",
  done: "green",
  cancel: "red",
};

const statusLabels = {
  [ENUM_CARE_RECORD_STATUS.PENDING]: "Chờ xử lý",
  [ENUM_CARE_RECORD_STATUS.IN_PROGRESS]: "Đang xử lý",
  [ENUM_CARE_RECORD_STATUS.DONE]: "Hoàn tất",
  [ENUM_CARE_RECORD_STATUS.CANCEL]: "Đã hủy",
};

const getCareRecordStatusOptions = (): {
  label: string;
  value: ENUM_CARE_RECORD_STATUS;
}[] => {
  return Object.values(ENUM_CARE_RECORD_STATUS).map((status) => ({
    label: statusLabels[status],
    value: status,
  }));
};

export { statusColors, statusLabels, getCareRecordStatusOptions };
