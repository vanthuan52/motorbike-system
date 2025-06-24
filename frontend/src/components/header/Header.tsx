"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { Menu, ShoppingCart, X } from "lucide-react";
import { CustomLink } from "@/components/CustomerLink/CustomLink";
import { ROUTER_PATH } from "@/constant/router-path";
import NavLink from "./NavLink";
import TopBar from "./TopBar";
import SearchOverlay from "./SearchOverlay";
import UserAvatar from "./UserAvatar";
import { mockUser } from "@/data/UserProfile";
import { RootState } from "@/store";
import "./styles.css";

const NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, key: "services" },
  { href: ROUTER_PATH.ABOUT, key: "about" },
  { href: ROUTER_PATH.BLOG, key: "blog" },
  { href: ROUTER_PATH.CONTACT, key: "contact" },
  { href: ROUTER_PATH.PART_TYPE, key: "category" },
];

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => setIsOpen(false), [pathname]);

  useEffect(() => {
    if (!showSearch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
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
        <TopBar onSearchClick={() => setShowSearch(true)} />

        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            <CustomLink href={ROUTER_PATH.HOME} className="text-xl font-bold">
              Logo name.
            </CustomLink>
          </div>

          <nav className="hidden md:flex gap-6 font-medium">
            {NAV_ITEMS.map(({ href, key }) => (
              <NavLink
                key={key}
                href={href}
                label={t(key)}
                isActive={pathname === href}
              />
            ))}
          </nav>

          <div className="flex gap-4">
            <CustomLink href="/gio-hang">
              <button className="p-2 flex items-center justify-center rounded-full border border-gray-300 relative cursor-pointer">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                    {cartCount}
                  </span>
                )}
              </button>
            </CustomLink>
            <UserAvatar user={mockUser} />
          </div>
        </div>

        {/* Mobile */}
        <div
          className={`fixed top-0 right-0 h-full w-full bg-white z-50 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full p-4 space-y-4 mt-7">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={28} />
              </button>
            </div>
            {NAV_ITEMS.map(({ href, key }) => (
              <NavLink
                key={href}
                href={href}
                label={t(key)}
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
