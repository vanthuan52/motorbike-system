import { useParams } from "react-router-dom";
import { BiBriefcase, BiCalendar, BiHome, BiIdCard, BiShield, BiUser } from "react-icons/bi";
import { Breadcrumb } from "antd";
import moment from "moment";
import { mockDataTableManageEmployees } from "../mocks/employees";
import EmployeeInfo from "../components/EmployeeInfo";

export default function EmployeeDetails() {
  const params = useParams()
  const employeeId = params.id;

  const employeeData = mockDataTableManageEmployees.find(
    (employee) => employee.id === employeeId
  );
  if (!employeeData) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy dữ liệu nhân viên
      </div>
    );
  }
  const breadcrumbItems = [
    {
      label: "Home",
      href: "/admin",
      icon: <BiHome className="text-xs" />,
    },
    {
      label: "Quản lý người dùng",
      href: "/admin/users-management/customers",
    },
    {
      label: "Nhân viên",
    },
    {
      label: `${employeeData.first_name} ${employeeData.last_name}`,
    },
  ];
  return (
    <div className="p-4 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <EmployeeInfo employeeData={employeeData} />
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Thông tin công việc</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10">
          <InfoItem
            icon={<BiIdCard size={20} />}
            label="Mã nhân viên"
            value={employeeData.employee_code || ""}
          />
          <InfoItem
            icon={<BiCalendar size={20} />}
            label="Ngày bắt đầu làm việc"
            value={moment(employeeData.start_date).format("DD-MM-YYYY")}
          />
          <InfoItem
            icon={<BiBriefcase size={20} />}
            label="Vị trí"
            value={employeeData.position || ""}
          />
          <InfoItem
            icon={<BiUser size={20} />}
            label="Loại tài khoản"
            value={employeeData.type || ""}
          />
          <InfoItem
            icon={<BiShield size={20} />}
            label="Vai trò hệ thống"
            value={employeeData.role || ""}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center space-x-3">
      <div>{icon}</div>
      <p className="text-base text-gray-700">
        <span className="font-medium">{label}</span> : {value}
      </p>
    </div>
  );
}