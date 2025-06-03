"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CustomLink } from "@/shared/components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";
import NavLink from "./NavLink";
import TopBar from "./TopBar";
import SearchOverlay from "./SearchOverlay";

const NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, label: "Dịch vụ" },
  { href: ROUTER_PATH.ABOUT, label: "Giới thiệu" },
  { href: ROUTER_PATH.BLOG, label: "Blog" },
  { href: ROUTER_PATH.CONTACT, label: "Liên hệ" },
  {
    href: ROUTER_PATH.CATEGORY,
    label: "Danh mục",
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLang, setSelectedLang] = useState<"VN" | "EN">("VN");
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!showSearch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
    };
  }, [showSearch]);

  return (
    <div>
      <SearchOverlay
        show={showSearch}
        value={searchValue}
        setValue={setSearchValue}
        onClose={() => setShowSearch(false)}
      />
      <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-2xs">
        <TopBar
          onSearchClick={() => setShowSearch(true)}
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
        />
        {/* Nav Bar */}
        <div className="container flex items-center justify-between py-2">
          <CustomLink href="/" className="text-xl font-bold">
            Logo name.
          </CustomLink>
          <nav className="hidden md:flex gap-6 font-medium">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink
                key={label}
                href={href}
                label={label}
                isActive={pathname === href}
              />
            ))}
          </nav>
          <div className="flex gap-4">
            <CustomLink href={ROUTER_PATH.MAINTAIN_REGISTRATION}>
              <button className="bg-black text-white font-medium px-5 py-2 rounded-md cursor-pointer">
                Đặt lịch
              </button>
            </CustomLink>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full p-4 space-y-4 mt-7">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                <X size={28} />
              </button>
            </div>
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={pathname === href}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}
