"use client";

import { useTransition, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface Props {
  currentLocale: "vi" | "en";
}

const FLAGS: Record<"vi" | "en", string> = {
  vi: "/images/flags/vn.png",
  en: "/images/flags/gb.png",
};
export default function LanguageDropdown({ currentLocale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleChangeLang = (lang: "vi" | "en") => {
    if (lang === currentLocale) return;

    const segments = pathname.split("/");
    const newPath = `/${lang}${
      segments[1] === "vi" || segments[1] === "en"
        ? "/" + segments.slice(2).join("/")
        : pathname
    }`;

    startTransition(() => {
      router.replace(newPath);
    });
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-2 py-1 rounded"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Image
          src={FLAGS[currentLocale]}
          alt={currentLocale}
          className="w-5 h-4 object-cover"
          width={30}
          height={20}
          unoptimized
        />
        <span>{currentLocale.toUpperCase()}</span>
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

      {open && (
        <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-20">
          {(["vi", "en"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleChangeLang(lang)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 cursor-pointer ${
                lang === currentLocale
                  ? "font-bold text-black"
                  : "text-gray-500"
              }`}
            >
              <Image
                src={FLAGS[lang]}
                alt={lang}
                className="w-5 h-5 rounded-full object-cover"
                width={30}
                height={20}
                unoptimized
              />
              <span>{lang.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
