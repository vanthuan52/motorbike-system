import clsx from "clsx";
import Image from "next/image";
import React from "react";

type props = {
  sampleMessages: string[];
  handleSendMessage: (msg: string) => void;
  currentTime: string;
};
export default function SampleMessages({
  sampleMessages,
  handleSendMessage,
  currentTime,
}: props) {
  return (
    <div className="flex items-start gap-2">
      <Image
        src="/images/chat.png"
        alt="Bot"
        width={32}
        height={32}
        className="rounded-full"
      />
      <div>
        <div className="font-semibold text-xs text-gray-500 mb-0.5">
          Chatbot · <span>{currentTime}</span>
        </div>
        <div className="bg-gray-100 text-black px-3 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[90%]">
          Hi there! Welcome to REVE Chat. How may I assist you today?
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {sampleMessages.map((msg, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(msg)}
              className={clsx(
                "px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer",
                "bg-white text-black hover:bg-gray-200"
              )}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
