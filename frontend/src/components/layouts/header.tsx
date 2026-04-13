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
import { Logo } from "@/components/ui/Logo";
import { mockUser } from "@/data/UserProfile";
import { RootState } from "@/store";
import { cn } from "@/utils/common.utils";
import "./styles.css";

const DESKTOP_NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, key: "services" },
  { href: ROUTER_PATH.ABOUT, key: "about" },
  { href: ROUTER_PATH.BLOG, key: "blog" },
  { href: ROUTER_PATH.PRODUCT, key: "product" },
  { href: ROUTER_PATH.CARE_REGISTRATION, key: "careRegistration" },
];

const MOBILE_NAV_ITEMS = [
  { href: ROUTER_PATH.SERVICES, key: "services" },
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

  const cartCount =
    useSelector((state: RootState) => state.cart.totalItems) ?? 0;

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
            <Logo />
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
              <button className="p-2 flex items-center justify-center rounded-full border border-border-strong relative cursor-pointer">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-error text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
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
      </header>

      {/* Mobile Navigation Drawer Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[998] bg-secondary-950/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[999] flex h-[100dvh] w-[85vw] max-w-[340px] flex-col overflow-y-auto bg-surface shadow-2xl transition-transform duration-300 ease-[var(--m3-easing-emphasized)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <Logo onClick={() => setIsOpen(false)} className="text-[22px]" />
          <button
            onClick={() => setIsOpen(false)}
            className="group relative flex size-10 items-center justify-center rounded-full bg-surface text-text-primary outline-none transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <div className="state-layer inset-0 rounded-full" />
            <X
              size={24}
              className="relative z-10 transition-transform group-hover:rotate-90 group-hover:text-error"
            />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-1.5 px-4 py-2">
          {MOBILE_NAV_ITEMS.map(({ href, key }) => {
            const isActive =
              href === pathname.replace("/vi", "").replace("/en", "");
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "relative flex items-center rounded-full px-5 py-3.5 text-[15px] font-semibold outline-none transition-all duration-200",
                  isActive
                    ? "bg-primary-100 text-primary-800"
                    : "text-text-primary hover:bg-surface-alt hover:text-primary-600 focus-visible:bg-surface-alt",
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>

        {/* Footer Assistance Block */}
        <div className="mt-auto p-6 pb-8">
          <div className="rounded-[var(--radius-lg)] bg-primary-50 p-5 text-center">
            <p className="mb-1 text-sm font-bold text-primary-800">
              Bạn cần hỗ trợ?
            </p>
            <p className="mb-4 text-xs font-medium text-primary-600">
              Hãy trò chuyện với đội ngũ của chúng tôi
            </p>
            <a
              href="tel:+84123456789"
              className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-primary-500 py-2.5 text-[13px] font-bold text-white shadow-[var(--shadow-sm)] outline-none transition-all hover:bg-primary-600 hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Gọi Hotline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
