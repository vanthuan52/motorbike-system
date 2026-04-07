import { UserProfile } from "@/features/user/types";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

type UserInfoProps = {
  user: UserProfile | null;
};

export default function UserInfo({ user }: UserInfoProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div className="mt-6 flex flex-col lg:flex-row items-start justify-between gap-8 p-2">
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-text-secondary text-sm">
          <div className="flex items-center gap-2">
            <MailOutlined style={{ fontSize: 18 }} /> <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneOutlined style={{ fontSize: 18 }} />{" "}
            <span>{user?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarOutlined style={{ fontSize: 18 }} />{" "}
            <span>{formatDate(new Date().toDateString())}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserOutlined style={{ fontSize: 18 }} /> <span>{"Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <EnvironmentOutlined style={{ fontSize: 18 }} />
            <span>{`${""}, ${""}, ${""}`}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-auto">
        <button className="bg-primary-500 text-white rounded-md px-5 py-2 hover:bg-primary-600 transition text-sm">
          Đặt lịch bảo dưỡng
        </button>
        <button className="border border-primary-500 text-primary-500 rounded-md px-5 py-2 hover:bg-primary-50 transition text-sm">
          Liên hệ kỹ thuật
        </button>
      </div>
    </div>
  );
}
