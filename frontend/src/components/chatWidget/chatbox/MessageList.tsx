import Image from "next/image";
import clsx from "clsx";
import { Message, MessageSocket } from "@/features/chat/types";
import { User } from "@/features/user/types";
import { FaCheckDouble } from "react-icons/fa";

type MessageListProps = {
  messages: MessageSocket[];
  endRef: React.RefObject<HTMLDivElement | null>;
  currentTime: string;
  userId?: string;
  users?: User[] | null;
  messageList?: Message[] | null;
};

export function MessageList({
  messages,
  endRef,
  currentTime,
  userId,
  users,
  messageList,
}: MessageListProps) {
  const historyMessages: (Message & { readBy?: any[] })[] = (
    messageList || []
  ).map((msg) => ({
    ...msg,
    _id: msg._id,
    sender:
      typeof msg.sender === "string"
        ? msg.sender
        : (msg.sender as { _id: string })._id,
    text: msg.content,
    createdAt: msg.timestamp
      ? new Date(msg.timestamp)
      : msg.createdAt instanceof Date
        ? msg.createdAt
        : new Date(),
    readBy: msg.readBy,
    updatedAt: msg.updatedAt,
  }));

  const allMessages = historyMessages;

  return (
    <div className="overflow-y-auto space-y-4 text-sm text-gray-900">
      {allMessages.map((msg: any, index: number) => {
        const isBot = msg.sender === "bot";
        const isUser = !!userId && msg.sender === userId;

        let isRead = false;
        let readUser = null;
        if (isUser && Array.isArray(msg.readBy)) {
          readUser = msg.readBy.find((u: any) => u._id !== userId);
          isRead = !!readUser;
        }

        const readTime = msg.updatedAt || msg.timestamp || msg.createdAt;

        return (
          <div
            key={msg._id ?? index}
            className={clsx("flex w-full", {
              "justify-end": isUser,
              "justify-start items-start gap-2": !isUser,
            })}
          >
            {!isUser && (
              <div className="flex-shrink-0">
                {isBot ? (
                  <Image
                    src="/images/chat.png"
                    alt="Bot Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  (() => {
                    const userObj = users?.find((u) => u._id === msg.sender);
                    const name = userObj?.username || userObj?.name || "User";
                    return (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`}
                        alt={name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    );
                  })()
                )}
              </div>
            )}

            <div
              className={clsx("flex flex-col w-full", {
                "items-end": isUser,
                "items-start": !isUser,
              })}
            >
              {isBot && (
                <span className="text-xs text-gray-500 font-semibold mb-1">
                  Chatbot · {currentTime}
                </span>
              )}
              <div
                className={clsx(
                  "px-3 py-2 rounded-lg max-w-[75%] break-words",
                  isBot
                    ? "bg-gray-100 text-black rounded-tl-none"
                    : isUser
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-tl-none"
                )}
              >
                {msg.text}
                {isUser && isRead && (
                  <span className="flex items-center gap-1 ml-2 text-xs text-blue-400">
                    <FaCheckDouble />
                    {readTime && (
                      <span>
                        {new Date(readTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
