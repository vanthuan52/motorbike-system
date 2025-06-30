"use client";

import { Search } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n";
import { APP_INFO } from "@/constant/application";
import LanguageDropdown from "./language-dropdown";

interface Props {
  onSearchClick: () => void;
}

export default function TopBar({ onSearchClick }: Props) {
  const locale = useLocale();

  return (
    <div className="w-full bg-black text-white text-sm">
      <div className="container flex items-center justify-between py-2">
        <Link href={`tel:${APP_INFO.HOTLINE}`}>
          Hotline: {APP_INFO.HOTLINE}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearchClick}
            className="p-1 rounded cursor-pointer transition"
            aria-label="Tìm kiếm"
          >
            <Search size={24} />
          </button>
          <LanguageDropdown currentLocale={locale as "vi" | "en"} />
        </div>
      </div>
    </div>
  );
}
