import { HiringStatusEnum, JobTypeEnum } from "../types";

export const STATUS_HIRING_OPTIONS = [
  { label: "Nháp", value: HiringStatusEnum.DRAFT },
  { label: "Đã đăng", value: HiringStatusEnum.PUBLISHED },
  { label: "Đã lưu trữ", value: HiringStatusEnum.ARCHIVED },
];

export const JOB_TYPE_OPTIONS = [
  { label: "Full-time", value: JobTypeEnum.FULL_TIME },
  { label: "Part-time", value: JobTypeEnum.PART_TIME },
  { label: "Hợp đồng", value: JobTypeEnum.CONTRACT },
  { label: "Khác", value: JobTypeEnum.ETC },
];
