import { ENUM_SERVICE_CHECKLIST_AREA } from "../types";

const SERVICE_CHECKLIST_AREA_OPTIONS = [
  { label: "Động cơ", value: ENUM_SERVICE_CHECKLIST_AREA.ENGINE },
  { label: "Truyền động", value: ENUM_SERVICE_CHECKLIST_AREA.TRANSMISSION },
  { label: "Giảm xóc", value: ENUM_SERVICE_CHECKLIST_AREA.SUSPENSION },
  { label: "Phanh", value: ENUM_SERVICE_CHECKLIST_AREA.BRAKE },
  { label: "Bánh xe", value: ENUM_SERVICE_CHECKLIST_AREA.WHEEL },
  { label: "Hệ thống điện", value: ENUM_SERVICE_CHECKLIST_AREA.ELECTRIC },
  { label: "Hệ thống nhiên liệu", value: ENUM_SERVICE_CHECKLIST_AREA.FUEL },
  { label: "Làm mát", value: ENUM_SERVICE_CHECKLIST_AREA.COOLING },
  { label: "Khung xe", value: ENUM_SERVICE_CHECKLIST_AREA.FRAME },
  {
    label: "Chăm sóc ngoại hình",
    value: ENUM_SERVICE_CHECKLIST_AREA.BODY_CARE,
  },
];

export default SERVICE_CHECKLIST_AREA_OPTIONS;
