import { Upload } from "antd";
import { FiPaperclip, FiMic } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

type MessageInputProps = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (text: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: (msg: string) => void;
  handleEmojiClick: (emoji: any) => void;
};

export function MessageInput({
  input,
  setInput,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSendMessage,
  handleEmojiClick,
}: any) {
  return (
    <div className="p-3 border-t bg-white relative">
      <div className="flex items-center gap-2">
        <Upload showUploadList={false}>
          <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <FiPaperclip size={18} />
          </button>
        </Upload>

        <div className="flex items-center flex-1 bg-gray-100 rounded-full px-3 py-2 relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(input);
            }}
            type="text"
            placeholder="Write your message..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <button
            onClick={() => setShowEmojiPicker((prev: boolean) => !prev)}
            className="text-gray-400 hover:text-gray-600"
          >
            <BsEmojiSmile size={18} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <FiMic size={18} />
        </button>
      </div>
    </div>
  );
}
