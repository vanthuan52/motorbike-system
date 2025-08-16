import { Avatar } from "antd";
import { UserMessage } from "../types";
export interface props {
  userDetails: UserMessage;
}
export default function UserDetails({ userDetails }: props) {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Avatar src={userDetails.avatar} size={130} />
      <h1 className="font-semibold text-lg sm:text-2xl">{userDetails.name}</h1>
      <span className="font-medium text-sm">{userDetails.role}</span>
      <span className="font-semibold text-sm">{userDetails.location}</span>
      <span className="font-medium text-sm">{userDetails.timezone}</span>
    </div>
  );
}
