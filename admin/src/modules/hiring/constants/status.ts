import { HiringStatusEnum } from "../types";

export const STATUS_HIRING_OPTIONS = [
  { label: "Nháp", value: HiringStatusEnum.Draft },
  { label: "Đã đăng", value: HiringStatusEnum.Published },
  { label: "Đã lưu trữ", value: HiringStatusEnum.Archived },
];
