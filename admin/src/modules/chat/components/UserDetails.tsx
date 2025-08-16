import { Role } from "@/modules/role/types";
import { Avatar } from "antd";
export interface props {
  userDetails: {
    _id: string;
    name: string;
    username: string;
    email: string;
    role?: Role;
  };
}
export default function UserDetails({ userDetails }: props) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Avatar
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails.name)}`}
        size={130}
      />
      <h1 className="font-semibold text-lg sm:text-2xl">{userDetails.name}</h1>
      <span className="font-medium text-sm">{userDetails.role?.name}</span>
      <span className="font-semibold text-sm">{userDetails.location}</span>
      <span className="font-medium text-sm">{userDetails.timezone}</span>
    </div>
  );
}
