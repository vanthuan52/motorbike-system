import { motion } from "framer-motion";
import { X } from "lucide-react";
type ChatPanelProps = {
  onSelect: (target: "support" | "chat") => void;
  onClose: () => void;
};

export default function ChatPanel({ onSelect, onClose }: ChatPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-white rounded-xl shadow-xl overflow-hidden"
    >
      <div className="border-b px-4 py-2 flex justify-between items-center bg-black text-white">
        <span>Chat Support</span>
        <button onClick={onClose} className="cursor-pointer">
          <X size={24} />
        </button>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-200 rounded-lg mb-3"
        />

        <div className="space-y-2">
          <button
            onClick={() => onSelect("support")}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            🤖 Chatbot
          </button>
          <button
            onClick={() => onSelect("chat")}
            className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
          >
            👤 Chat with us
          </button>
        </div>
      </div>
    </motion.div>
  );
}
