import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import Image from "next/image";
import { ChatHeader } from "./ChatHeader";
import SampleMessages from "./SampleMessages";
import { MessageList } from "./MessageList";
import MessageInput from "./MessageInput";
import "../css/chatWidget.css";
type ChatBoxProps = {
  type: "bot" | "agent";
  onBack: () => void;
  onClose: () => void;
};

const sampleMessages = [
  "Question",
  "Book vehicle maintenance",
  "Search for vehicle parts",
  "Chat with a Live Agent",
];

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatBox({ type, onBack, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const currentTime = dayjs().format("h:mm A");

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMsg: Message = { sender: "user", text };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        sender: "bot",
        text: "Thank you for reaching out. We'll get back to you shortly!",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  const handleEmojiClick = (emoji: any) => {
    setInput((prev) => prev + emoji.emoji);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="sm:w-96 w-full h-[500px] bg-white rounded-2xl shadow-xl flex flex-col"
    >
      <ChatHeader type={type} onBack={onBack} onClose={onClose} />

      <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-900 space-y-3">
        <SampleMessages
          sampleMessages={sampleMessages}
          handleSendMessage={handleSendMessage}
          currentTime={currentTime}
        />

        <MessageList
          messages={messages}
          endRef={endRef}
          currentTime={currentTime}
        />

        {isTyping && (
          <div className="flex items-start gap-2">
            <Image
              src="/bot-avatar.png"
              alt="Bot"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="bg-gray-100 text-black px-3 py-2 rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[90%]">
              <div className="loader"></div>
            </div>
          </div>
        )}
      </div>

      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={handleSendMessage}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
        handleSendMessage={handleSendMessage}
      />
    </motion.div>
  );
}
