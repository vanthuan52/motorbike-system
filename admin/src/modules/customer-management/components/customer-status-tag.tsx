import React from "react";
import { Tag } from "antd";
import { ENUM_USER_STATUS } from "@/modules/user/types";

interface CustomerStatusTagProps {
  status: ENUM_USER_STATUS;
}

const CustomerStatusTag: React.FC<CustomerStatusTagProps> = ({ status }) => {
  switch (status) {
    case ENUM_USER_STATUS.ACTIVE:
      return <Tag color="green">Còn hoạt động</Tag>;
    case ENUM_USER_STATUS.INACTIVE:
      return <Tag color="orange">Không hoạt động</Tag>;
    case ENUM_USER_STATUS.BLOCKED:
      return <Tag color="red">Đã chặn</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export default CustomerStatusTag;
