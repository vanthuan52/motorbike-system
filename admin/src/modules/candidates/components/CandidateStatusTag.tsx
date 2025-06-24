import { Tag } from "antd";
import { ENUM_CANDIDATE_STATUS } from "../types";

const statusColorMap: Record<ENUM_CANDIDATE_STATUS, string> = {
  [ENUM_CANDIDATE_STATUS.NEW]: "blue",
  [ENUM_CANDIDATE_STATUS.REVIEWED]: "purple",
  [ENUM_CANDIDATE_STATUS.INTERVIEW_SCHEDULED]: "orange",
  [ENUM_CANDIDATE_STATUS.REJECTED]: "red",
  [ENUM_CANDIDATE_STATUS.HIRED]: "green",
};

const statusLabelMap: Record<ENUM_CANDIDATE_STATUS, string> = {
  [ENUM_CANDIDATE_STATUS.NEW]: "Mới",
  [ENUM_CANDIDATE_STATUS.REVIEWED]: "Đã xem",
  [ENUM_CANDIDATE_STATUS.INTERVIEW_SCHEDULED]: "Hẹn phỏng vấn",
  [ENUM_CANDIDATE_STATUS.REJECTED]: "Từ chối",
  [ENUM_CANDIDATE_STATUS.HIRED]: "Đã tuyển",
};

const CandidateStatusTag = ({ status }: { status: ENUM_CANDIDATE_STATUS }) => {
  return <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>;
};

export default CandidateStatusTag;
