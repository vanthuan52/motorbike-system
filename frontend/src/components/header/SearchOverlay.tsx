import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  show: boolean;
  value: string;
  setValue: (v: string) => void;
  onClose: () => void;
}

export default function SearchOverlay({
  show,
  value,
  setValue,
  onClose,
}: Props) {
  const t = useTranslations("Header");
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-gradient-to-br from-white/60 via-white/10 to-white/60 backdrop-blur-[6px] cursor-pointer"
          onClick={onClose}
          style={{
            maskImage:
              "linear-gradient(135deg,rgba(255,255,255,0.7) 60%,rgba(255,255,255,0.1) 100%)",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      </div>
      <div className="w-full max-w-xl px-4 z-10">
        <div
          className="relative flex items-center"
          style={{
            animation: "slideDownSearch 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full py-4 pl-12 pr-4 bg-white text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 rounded-[30px]"
          />
          <Search className="absolute left-4 text-gray-400" size={24} />
          <button
            className="absolute right-3 text-gray-400 hover:text-black transition cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            tabIndex={-1}
            aria-label={t("closeSearch")}
          >
            <X size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
