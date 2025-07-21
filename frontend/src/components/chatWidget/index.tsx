"use client";

import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";
import ChatBox from "./chatbox/ChatBox";
import { AnimatePresence } from "framer-motion";
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<"bot" | "agent" | null>(
    null
  );

  const toggleChat = () => setIsOpen(!isOpen);
  const handleSelectChat = (target: "bot" | "agent") => setSelectedChat(target);

  return (
    <div className="fixed sm:bottom-4 sm:right-4 right-4 bottom-4 z-50">
      <AnimatePresence mode="wait">
        {isOpen ? (
          selectedChat ? (
            <ChatBox
              type={selectedChat}
              onBack={() => setSelectedChat(null)}
              onClose={toggleChat}
            />
          ) : (
            <ChatPanel onSelect={handleSelectChat} onClose={toggleChat} />
          )
        ) : (
          <ChatButton onClick={toggleChat} />
        )}
      </AnimatePresence>
    </div>
  );
}
