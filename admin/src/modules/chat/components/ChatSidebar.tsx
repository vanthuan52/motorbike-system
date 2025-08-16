"use client";
import { Avatar } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import { PiNotePencilLight } from "react-icons/pi";
import { Conversation } from "../types";
import ModalCreateNewConv from "./modal/ModalCreateNewConv";

interface ChatSidebarProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  search?: string;
  onSearch?: (search: string) => void;
  selectedConversation?: Conversation | null;
  onStartNewConversation?: (userId: string) => void;
}

export default function ChatSidebar({
  conversations,
  onSelectConversation,
  search = "",
  onSearch,
  selectedConversation,
  onStartNewConversation,
}: ChatSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCompleteValue, setAutoCompleteValue] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredConversations =
    (isMobile || showSearch) && searchValue
      ? conversations.filter(
          (conv) =>
            conv.user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
        )
      : conversations;

  const autoCompleteOptions = conversations.map((conv) => ({
    value: conv.user.id,
    label: (
      <div className="flex flex-row gap-2 items-center">
        <Avatar src={conv.user.avatar} size={24} />
        <span>{conv.user.name}</span>
      </div>
    ),
  }));
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAutoCompleteValue("");
  };

  const handleSelectUser = (value: string) => {
    const selectedUser = conversations.find(
      (conv) => conv.user.id === value
    )?.user;
    setAutoCompleteValue(value);
    setSelectedUserName(selectedUser?.name || "");
  };

  const handleModalOk = () => {
    if (autoCompleteValue) {
      onStartNewConversation?.(autoCompleteValue); // Call callback with user.id
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
        const isSelected =
          selectedConversation && conv.id === selectedConversation.id;
        return (
          <div
            key={conv.id}
            className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
              isSelected ? "bg-gray-300" : ""
            }`}
            onClick={() => onSelectConversation(conv)}
          >
            <Avatar src={conv.user.avatar} size={40} />
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between gap-2 min-w-0">
                <span
                  className="font-medium truncate max-w-[120px] block"
                  title={conv.user.name}
                >
                  {conv.user.name}
                </span>
                <span className="text-xs whitespace-nowrap">
                  {conv.lastMessageTime}
                </span>
              </div>
              <p
                className="text-sm text-gray-600 truncate max-w-full block"
                title={conv.lastMessage}
              >
                {conv.lastMessage}
              </p>
            </div>
          </div>
        );
      })}
      <ModalCreateNewConv
        isModalOpen={isModalOpen}
        handleModalOk={handleModalOk}
        handleCloseModal={handleCloseModal}
        autoCompleteValue={autoCompleteValue}
        autoCompleteOptions={autoCompleteOptions}
        setAutoCompleteValue={setAutoCompleteValue}
        handleSelectUser={handleSelectUser}
        conversations={conversations}
        selectedUserName={selectedUserName}
      />
    </div>
  );
}
