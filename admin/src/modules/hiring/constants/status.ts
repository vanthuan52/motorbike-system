import { ENUM_HIRING_STATUS, ENUM_HIRING_JOB_TYPE } from "../types";

export const STATUS_HIRING_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { label: "Nháp", value: ENUM_HIRING_STATUS.DRAFT },
  { label: "Đã đăng", value: ENUM_HIRING_STATUS.PUBLISHED },
  { label: "Đã lưu trữ", value: ENUM_HIRING_STATUS.ARCHIVED },
];

export const JOB_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { label: "Full-time", value: ENUM_HIRING_JOB_TYPE.FULL_TIME },
  { label: "Part-time", value: ENUM_HIRING_JOB_TYPE.PART_TIME },
  { label: "Hợp đồng", value: ENUM_HIRING_JOB_TYPE.CONTRACT },
  { label: "Khác", value: ENUM_HIRING_JOB_TYPE.ETC },
];
