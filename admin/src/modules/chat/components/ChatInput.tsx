import { Input, Upload } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { useState } from "react";
interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (text: string) => void;
}
export default function ChatInput({
  input,
  setInput,
  handleSendMessage,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="p-2 border-t bg-white">
      <div className="flex items-end gap-2">
        <Upload>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-500 flex-shrink-0"
          >
            <PaperClipOutlined style={{ fontSize: 22 }} />
          </button>
        </Upload>
        <Input
          placeholder="Nhập tin nhắn"
          className="rounded-lg resize-none !py-2 !px-3 flex-1"
          style={{ minHeight: 44, fontSize: 16 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(input);
          }}
        />
        <button
          type="button"
          className="p-2 text-blue-500 hover:text-blue-600 flex-shrink-0"
          onClick={handleSend}
        >
          <SendOutlined style={{ fontSize: 22 }} />
        </button>
      </div>
    </div>
  );
}
