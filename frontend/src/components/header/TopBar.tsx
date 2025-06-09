import Link from "next/link";
import { User2, Search } from "lucide-react";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { APP_INFO } from "@/constant/application";
import LanguageDropdown from "./LanguageDropdown";

interface Props {
  onSearchClick: () => void;
  selectedLang: "VN" | "EN";
  setSelectedLang: (lang: "VN" | "EN") => void;
}

export default function TopBar({
  onSearchClick,
  selectedLang,
  setSelectedLang,
}: Props) {
  return (
    <div className="w-full bg-black text-white text-sm">
      <div className="container flex items-center justify-between py-2">
        <Link href={`tel:${APP_INFO.HOTLINE}`}>
          Hotline: {APP_INFO.HOTLINE}
        </Link>
        <div className="flex items-center gap-1">
          {/* <CustomLink href="login">
            <User2 size={24} />
          </CustomLink> */}
          <button
            type="button"
            onClick={onSearchClick}
            className="p-1 rounded cursor-pointer transition "
            aria-label="Tìm kiếm"
          >
            <Search size={24} />
          </button>
          <LanguageDropdown
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
          />
        </div>
      </div>
    </div>
  );
}
