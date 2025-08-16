import { Input, Upload } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
interface ChatInputProps {
  onSendMessage: (content: string) => void;
  clearInput?: boolean;
}
export default function ChatInput({
  onSendMessage,
  clearInput,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (clearInput) {
      setInputValue("");
    }
  }, [clearInput]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
        <Input.TextArea
          placeholder="Nhập tin nhắn"
          className="rounded-lg resize-none !py-2 !px-3 flex-1"
          style={{ minHeight: 44, fontSize: 16 }}
          rows={1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
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
