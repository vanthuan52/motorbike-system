import { useRef } from "react";

interface Props {
  selectedLang: "VN" | "EN";
  setSelectedLang: (lang: "VN" | "EN") => void;
}

export default function LanguageDropdown({
  selectedLang,
  setSelectedLang,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded transition select-none"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded="false"
        onClick={(e) => {
          const menu = e.currentTarget.nextElementSibling;
          if (menu) {
            menu.classList.toggle("opacity-0");
            menu.classList.toggle("pointer-events-none");
          }
        }}
      >
        <span>{selectedLang === "EN" ? "EN" : "VN"}</span>
        <svg
          className="w-3 h-3 ml-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute right-0 mt-1 w-16 bg-white border border-gray-200 rounded shadow-lg opacity-0 pointer-events-none transition-opacity z-20">
        <button
          className={`block w-full text-left px-3 py-2 cursor-pointer ${
            selectedLang === "VN" ? "font-bold text-black" : "text-gray-500"
          }`}
          onClick={() => {
            setSelectedLang("VN");
            const parent = dropdownRef.current?.querySelector("div");
            if (parent) {
              parent.classList.add("opacity-0", "pointer-events-none");
            }
          }}
          tabIndex={0}
        >
          VN
        </button>
        <button
          className={`block w-full text-left px-3 py-2 cursor-pointer ${
            selectedLang === "EN" ? "font-bold text-black" : "text-gray-500"
          }`}
          onClick={() => {
            setSelectedLang("EN");
            const parent = dropdownRef.current?.querySelector("div");
            if (parent) {
              parent.classList.add("opacity-0", "pointer-events-none");
            }
          }}
          tabIndex={0}
        >
          EN
        </button>
      </div>
    </div>
  );
}
