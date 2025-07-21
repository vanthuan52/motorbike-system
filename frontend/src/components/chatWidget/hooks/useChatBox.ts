import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Message } from "../chatbox/types";

export function useChatBox(sampleMessages: string[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const currentTime = dayjs().format("h:mm A");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
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

  return {
    messages,
    input,
    isTyping,
    showEmojiPicker,
    currentTime,
    endRef,
    sendMessage,
    setInput,
    setShowEmojiPicker,
  };
}
