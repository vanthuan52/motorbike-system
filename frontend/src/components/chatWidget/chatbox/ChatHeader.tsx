import { FaArrowLeftLong } from "react-icons/fa6";
import { X } from "lucide-react";
import { User } from "@/features/user/types";

type ChatHeaderProps = {
  type?: "support" | "chat";
  onBack?: () => void;
  onClose?: () => void;
  users?: User[] | null;
};

export function ChatHeader({ type, onBack, onClose, users }: ChatHeaderProps) {
  if (!users) return null;
  return (
    <div className="border-b px-4 py-2 bg-black text-white flex justify-between items-center rounded-t-2xl">
      <button onClick={onBack} className="cursor-pointer">
        <FaArrowLeftLong />
      </button>
      <span className="text-sm font-semibold capitalize">
        {type === "support" ? "Chatbot" : users[0]?.name || users[0]?.username}
      </span>
      <button onClick={onClose} className="cursor-pointer">
        <X size={24} />
      </button>
    </div>
  );
}
