import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
    >
      <MessageCircle size={24} />
    </button>
  );
}
