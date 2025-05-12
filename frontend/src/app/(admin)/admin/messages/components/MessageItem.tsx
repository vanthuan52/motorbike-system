import { memo } from "react";
import { Avatar } from "antd";
import { BsCheck2All } from "react-icons/bs";
import { messageUtils } from "@/utils/messageUtils";
import { Conversation, Message } from "@/types/Messages";

interface MessageItemProps {
  message: Message;
  conversation: Conversation;
  isSelected: boolean;
  onClick: (id: string) => void;
  today: string;
}

const MessageItem = ({
  message,
  conversation,
  isSelected,
  onClick,
  today,
}: MessageItemProps) => {
  const { senderId, content, timestamp, isRead, readAt, id } = message;
  console.log(senderId, conversation);

  const avatarSrc = messageUtils.getAvatar(senderId, conversation);
  const status = messageUtils.getMessageStatus(
    senderId,
    isRead,
    readAt,
    timestamp,
    today
  );

  return (
    <div
      className={`flex mb-2 ${
        senderId === "2" ? "justify-end" : "justify-start"
      }`}
    >
      {senderId !== "2" && (
        <Avatar src={avatarSrc} size={32} className="mr-2" />
      )}
      <div className="flex flex-col max-w-xs">
        <div
          className={`p-2 rounded-lg cursor-pointer ${
            senderId === "2" ? "bg-gray-200 text-black" : "bg-white text-black"
          }`}
          onClick={() => onClick(id)}
        >
          {isSelected && (
            <div className="text-xs text-gray-500 mb-1">
              {messageUtils.formatSendTime(timestamp)}
            </div>
          )}
          {content}
        </div>
        {status && (
          <div className="flex justify-end text-xs text-gray-500 mt-1">
            <span>{status.text}</span>
            {status.showCheck && (
              <BsCheck2All className="ml-1 text-blue-500" size={14} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessageItem);
