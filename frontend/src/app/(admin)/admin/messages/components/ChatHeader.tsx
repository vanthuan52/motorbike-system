"use client";
import { useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { MdOutlineSearch } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { UserMessage } from "@/types/Messages";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
interface ChatHeaderProps {
  user: UserMessage;
  onToggleMediaSidebar: () => void;
  onBack: () => void;
}

export default function ChatHeader({
  user,
  onToggleMediaSidebar,
  onBack,
}: ChatHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white relative min-h-20">
      {isSearchOpen ? (
        <div
          className="flex items-center w-full animate-slide-in"
          key="search-input"
        >
          <input
            type="text"
            placeholder="Tìm kiếm tin nhắn"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-300"
            autoFocus
          />
          <MdOutlineSearch
            size={36}
            className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 ml-2 transition-all duration-200"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <LeftOutlined
              onClick={onBack}
              size={32}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-all"
            />
            <Avatar src={user.avatar} size={40} />
            <div className="ml-3">
              <CustomLink href={`customers/customer-details?id=${user.id}`}>
                <h3 className="font-semibold">{user.name}</h3>
              </CustomLink>
              <p className="text-sm text-gray-500">{user.lastSeen}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MdOutlineSearch
              size={36}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-all"
              onClick={() => setIsSearchOpen(true)}
            />
            <BsThreeDotsVertical
              size={32}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-all"
              onClick={onToggleMediaSidebar}
            />
          </div>
        </>
      )}
    </div>
  );
}
