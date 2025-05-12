"use client";
import { Conversation, Message } from "@/types/Messages";
import { useState } from "react";
import MessageItem from "./MessageItem";
interface ChatMessagesProps {
  messages: Message[];
  conversation: Conversation;
}

export default function ChatMessages({
  messages,
  conversation,
}: ChatMessagesProps) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const today = new Date().toLocaleDateString();

  const groupedMessages: { [date: string]: Message[] } = messages.reduce(
    (acc, msg) => {
      const date = new Date(msg.timestamp).toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    },
    {} as { [date: string]: Message[] }
  );

  const handleMessageClick = (id: string) => {
    setSelectedMessageId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 bg-gradient-to-r from-white to-blue-100">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="text-center text-sm text-gray-500 my-4">{date}</div>
          {msgs.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              conversation={conversation}
              isSelected={selectedMessageId === msg.id}
              onClick={handleMessageClick}
              today={today}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
