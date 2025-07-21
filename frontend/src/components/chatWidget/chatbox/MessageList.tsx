import Image from "next/image";
import clsx from "clsx";
import { Message } from "./types";

type MessageListProps = {
  messages: Message[];
  endRef: React.RefObject<HTMLDivElement | null>;
  currentTime: string;
};

export function MessageList({
  messages,
  endRef,
  currentTime,
}: MessageListProps) {
  return (
    <div className="overflow-y-auto space-y-4 text-sm text-gray-900">
      {messages.map((msg, index) => {
        const isBot = msg.sender === "bot";

        return (
          <div
            key={index}
            className={clsx("flex w-full", {
              "justify-start items-start gap-2": isBot,
              "justify-end": !isBot,
            })}
          >
            {isBot && (
              <div className="flex-shrink-0">
                <Image
                  src="/images/chat.png"
                  alt="Bot Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}

            <div
              className={clsx("flex flex-col w-full", { "items-end": !isBot })}
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
                    : "bg-black text-white rounded-br-none"
                )}
              >
                {msg.text}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={endRef} />
    </div>
  );
}
