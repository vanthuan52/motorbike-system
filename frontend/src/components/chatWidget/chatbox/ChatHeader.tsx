import { FaArrowLeftLong } from "react-icons/fa6";
import { X } from "lucide-react";

type ChatHeaderProps = {
  type: "bot" | "agent";
  onBack: () => void;
  onClose: () => void;
};

export function ChatHeader({ type, onBack, onClose }: ChatHeaderProps) {
  return (
    <div className="border-b px-4 py-2 bg-black text-white flex justify-between items-center rounded-t-2xl">
      <button onClick={onBack} className="cursor-pointer">
        <FaArrowLeftLong />
      </button>
      <span className="text-sm font-semibold">
        {type === "bot" ? "REVE Chatbot" : "Technician support"}
      </span>
      <button onClick={onClose} className="cursor-pointer">
        <X size={24} />
      </button>
    </div>
  );
}
