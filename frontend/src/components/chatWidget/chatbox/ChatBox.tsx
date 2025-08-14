import { motion } from "framer-motion";
import Image from "next/image";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import "../css/chatWidget.css";
import { Message } from "@/features/chat/types";
import SampleMessages from "./SampleMessages";
import { User } from "@/features/user/types";
import { useChatBox } from "../hooks/useChatBox";
type ChatBoxProps = {
  type?: "support" | "chat";
  onBack?: () => void;
  onClose?: () => void;
  conversationId?: string | null;
  userId?: string;
  users?: User[] | null;
  messages?: Message[] | null;
};

const sampleMessages = [
  "Question",
  "Book vehicle maintenance",
  "Search for vehicle parts",
  "Chat with a Live Agent",
];

export default function ChatBox({
  type,
  onBack,
  onClose,
  conversationId,
  userId,
  users,
  messages: messageList,
}: ChatBoxProps) {
  const {
    messages,
    input,
    isTyping,
    showEmojiPicker,
    typingUserId,
    endRef,
    currentTime,
    filteredMessages,
    filteredMessageList,
    handleSendMessage,
    handleEmojiClick,
    onInputChange,
    setShowEmojiPicker,
  } = useChatBox({
    type,
    conversationId,
    userId,
    users,
    messageList,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="sm:w-96 w-full h-[500px] bg-white rounded-2xl shadow-xl flex flex-col"
    >
      <ChatHeader type={type} onBack={onBack} onClose={onClose} users={users} />
      <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-900 space-y-3">
        <SampleMessages
          sampleMessages={sampleMessages}
          handleSendMessage={handleSendMessage}
          currentTime={currentTime}
        />

        <MessageList
          userId={userId}
          users={users}
          messages={filteredMessages}
          endRef={endRef}
          currentTime={currentTime}
          messageList={filteredMessageList}
        />

        {isTyping && typingUserId && (
          <div className="flex items-start gap-2">
            <img
              src={(() => {
                const userObj = users?.find((u) => u._id === typingUserId);
                return `https://ui-avatars.com/api/?name=${userObj?.username}`;
              })()}
              alt="Typing User"
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
        setInput={(v: string) => onInputChange(v)}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
        handleSendMessage={handleSendMessage}
      />
    </motion.div>
  );
}
