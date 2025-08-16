import { useState } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { MdOutlineSearch } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

interface ChatHeaderProps {
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
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
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="ml-3">
              <Link to={`customers/customer-details?id=${user._id}`}>
                <h3 className="font-semibold">{user.name}</h3>
              </Link>
              {/* <p className="text-sm text-gray-500">{user?.lastSeen}</p> */}
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
