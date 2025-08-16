import { Avatar } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { PiNotePencilLight } from "react-icons/pi";
import { Conversation } from "../types";
import ModalCreateNewConv from "./modal/ModalCreateNewConv";
import { User } from "@/modules/user/types";

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: Conversation["_id"]) => void;
  search?: string;
  onSearch?: (search: string) => void;
  selectedConversation?: Conversation["_id"] | null;
  onStartNewConversation?: (userId: string) => void;
  currentUserId: User["_id"] | null;
  users?: User[];
}

export default function ChatSidebar({
  conversations,
  onSelectConversation,
  search = "",
  onSearch,
  selectedConversation,
  onStartNewConversation,
  currentUserId,
  users,
}: ChatSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredConversations =
    (isMobile || showSearch) && searchValue
      ? conversations.filter((conv) => {
          const otherUser = conv.participants.find(
            (u) => u._id !== currentUserId
          );
          return (
            otherUser?.name
              ?.toLowerCase()
              .includes(searchValue.toLowerCase()) ||
            conv.lastMessage?.content
              ?.toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        })
      : conversations;

  const autoCompleteOptions = (users || []).map((user) => ({
    value: user._id,
    label: (
      <div className="flex flex-row gap-2 items-center">
        <Avatar
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
          size={24}
        />
        <span>{user.name}</span>
      </div>
    ),
    searchText: user.name,
  }));
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInputValue("");
    setSelectedUserId(null);
  };

  const handleSelectUser = (value: string, option: any) => {
    setSelectedUserId(value);
    setInputValue(option?.label?.props?.children[1]?.props?.children || "");
  };

  const handleModalOk = () => {
    if (selectedUserId) {
      onStartNewConversation?.(selectedUserId);
      handleCloseModal();
    }
  };
  return (
    <div className="overflow-y-auto overflow-x-hidden p-4 shadow-md scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
      <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold">Tin nhắn</h2>
        {!isMobile && (
          <div className="flex">
            <MdOutlineSearch
              size={40}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2"
              onClick={() => setShowSearch((v) => !v)}
            />
            <PiNotePencilLight
              size={40}
              className="cursor-pointer hover:bg-gray-100 rounded-lg p-2"
              onClick={handleOpenModal}
            />
          </div>
        )}
      </div>
      {(isMobile || showSearch) && (
        <input
          autoFocus={!isMobile}
          type="text"
          placeholder="Tìm kiếm..."
          className="mb-4 w-full border rounded px-3 py-2 outline-none"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onSearch?.(e.target.value);
          }}
        />
      )}
      {filteredConversations.map((conv) => {
        const otherUser = conv.participants.find(
          (u) => u._id !== currentUserId
        );
        if (!otherUser) return null;
        const isSelected =
          selectedConversation && conv._id === selectedConversation;

        const lastMsgContent = conv.lastMessage?.content || "";
        const lastMsgTime = conv.lastMessage?.timestamp
          ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div
            key={conv._id}
            className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
              isSelected ? "bg-gray-300" : ""
            }`}
            onClick={() => onSelectConversation(conv._id)}
          >
            <Avatar
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}`}
              size={40}
            />
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between gap-2 min-w-0">
                <span
                  className="font-medium truncate max-w-[120px] block"
                  title={otherUser.name}
                >
                  {otherUser.name}
                </span>
                <span className="text-xs whitespace-nowrap">{lastMsgTime}</span>
              </div>
              <p
                className="text-sm text-gray-600 truncate max-w-full block"
                title={lastMsgContent}
              >
                {lastMsgContent}
              </p>
            </div>
          </div>
        );
      })}
      <ModalCreateNewConv
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleCloseModal={handleCloseModal}
        autoCompleteOptions={autoCompleteOptions}
        handleSelectUser={handleSelectUser}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
}
