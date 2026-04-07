import { MessageCircle } from "lucide-react";

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary-500 text-white shadow-[var(--shadow-md)] outline-none state-layer transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-[var(--shadow-lg)] active:shadow-[var(--shadow-md-active)] focus-visible:shadow-[var(--shadow-focus-ring)]"
    >
      <MessageCircle size={22} />
    </button>
  );
}
