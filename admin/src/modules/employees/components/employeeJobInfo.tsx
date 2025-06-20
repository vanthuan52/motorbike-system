import React from "react";
import {
  BiBriefcase,
  BiCalendar,
  BiIdCard,
  BiShield,
  BiUser,
} from "react-icons/bi";
import moment from "moment";
import { EmployeeType } from "../types";

interface Props {
  employee: EmployeeType;
}

const EmployeeJobInfo: React.FC<Props> = ({ employee }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Thông tin công việc</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
        <InfoItem
          icon={<BiIdCard size={20} />}
          label="Mã nhân viên"
          value={employee.employee_code || ""}
        />
        <InfoItem
          icon={<BiCalendar size={20} />}
          label="Ngày bắt đầu làm việc"
          value={moment(employee.start_date).format("DD-MM-YYYY")}
        />
        <InfoItem
          icon={<BiBriefcase size={20} />}
          label="Vị trí"
          value={employee.position || ""}
        />
        <InfoItem
          icon={<BiUser size={20} />}
          label="Loại tài khoản"
          value={employee.type || ""}
        />
        <InfoItem
          icon={<BiShield size={20} />}
          label="Vai trò hệ thống"
          value={employee.role || ""}
        />
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div>{icon}</div>
      <p className="text-base text-gray-700">
        <span className="font-medium">{label}</span> : {value}
      </p>
    </div>
  );
};

export default EmployeeJobInfo;
