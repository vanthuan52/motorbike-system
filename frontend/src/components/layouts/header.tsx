"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Link, TRANSLATION_FILES } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";
import NavLink from "./nav-link";
import TopBar from "./topbar";
import SearchOverlay from "./search-overlay";
import UserAvatar from "./user-avatar";
import { mockUser } from "@/data/UserProfile";
import { RootState } from "@/store";
import "./styles.css";

const DESKTOP_NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, key: "services" },
  { href: ROUTER_PATH.ABOUT, key: "about" },
  { href: ROUTER_PATH.BLOG, key: "blog" },
  { href: ROUTER_PATH.CONTACT, key: "contact" },
  { href: ROUTER_PATH.CARE_REGISTRATION, key: "careRegistration" },
];

const MOBILE_NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, key: "services" },
  { href: ROUTER_PATH.CARE_SERVICES, key: "careService" },
  { href: ROUTER_PATH.ABOUT, key: "about" },
  { href: ROUTER_PATH.BLOG, key: "blog" },
  { href: ROUTER_PATH.CONTACT, key: "contact" },
  { href: ROUTER_PATH.CARE_REGISTRATION, key: "careRegistration" },
  { href: ROUTER_PATH.PART_TYPE, key: "partType" },
  { href: ROUTER_PATH.PRODUCT, key: "product" },
  { href: ROUTER_PATH.POLICY, key: "policy" },
  { href: ROUTER_PATH.FAQS, key: "faqs" },
  { href: ROUTER_PATH.HIRING, key: "hiring" },
];

export default function Header() {
  const t = useTranslations(`${TRANSLATION_FILES.COMMON}.nav`);
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
            <Link href={ROUTER_PATH.HOME} className="text-xl font-bold">
              Logo name.
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 font-medium">
            {DESKTOP_NAV_ITEMS.map(({ href, key }) => (
              <NavLink
                key={key}
                href={href}
                label={t(key)}
                isActive={
                  href === pathname.replace("/vi", "").replace("/en", "")
                }
              />
            ))}
          </nav>

          <div className="flex gap-4">
            <Link href="/gio-hang">
              <button className="p-2 flex items-center justify-center rounded-full border border-gray-300 relative cursor-pointer">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
            <UserAvatar user={mockUser} />
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 right-0 h-full w-[300px] bg-white z-50 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full py-4 px-8 space-y-4 mt-7">
            <div className="flex justify-between items-center ">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col mt-5 gap-5">
              {MOBILE_NAV_ITEMS.map(({ href, key }) => (
                <NavLink
                  key={href}
                  href={href}
                  label={t(key)}
                  isActive={
                    href === pathname.replace("/vi", "").replace("/en", "")
                  }
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
