import { CameraOutlined } from "@ant-design/icons";
import { UserProfile } from "@/features/user/types";

interface AvatarSectionProps {
  user: UserProfile | null;
}

export default function AvatarSection({ user }: AvatarSectionProps) {
  return (
    <div className="relative z-10 -mt-20 flex flex-col items-center">
      <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-md bg-gray-200 overflow-visible">
        <img
          src={"/images/avatar.png"}
          alt="Avatar người dùng"
          className="object-cover rounded-full"
        />
        <button className="absolute bottom-0 right-0 z-20 bg-violet-600 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md hover:bg-violet-700 transition">
          <CameraOutlined style={{ fontSize: 16 }} />
        </button>
      </div>
      <h1 className="mt-4 text-3xl font-semibold">{`${user?.name}`}</h1>
    </div>
  );
}
