import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { SidebarMenuItem } from "./sidebar-menu";
import { useSidebarActive } from "@/hooks/use-sidebar-active";
import { useSidebarHover } from "@/hooks/use-sidebar-hover";

interface Props {
  item: SidebarMenuItem;
  collapsed: boolean;
  isOpen: boolean;
  toggleOpen: (key: string) => void;
  setSidebarCollapsed: (value: boolean) => void;
}

export default function SidebarItem({
  item,
  collapsed,
  isOpen,
  toggleOpen,
}: Props) {
  const { pathname } = useLocation();

  const { hasChildren, isActive, parentBgClass } = useSidebarActive(
    item,
    pathname
  );

  const {
    triggerRef,
    hovered,
    menuPos,
    setHovered,
    handleMouseEnter,
    handleMouseLeave,
    openHoverMenu,
  } = useSidebarHover<HTMLDivElement>(collapsed, hasChildren);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx(
          "flex items-center justify-between p-2 rounded-md cursor-pointer transition-all",
          parentBgClass,
          !parentBgClass && "hover:bg-[#c5d4ec]"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleOpen(item.key);
        }}
      >
        <Link
          className="flex items-center gap-1"
          to={item.href || "#"}
          onClick={(e) => {
            if (collapsed && hasChildren) {
              e.preventDefault();
              openHoverMenu();
            }
          }}
        >
          <span className="text-xl font-medium">{item.icon}</span>
          <span
            className={clsx(
              isActive ? "font-semibold" : "font-medium",
              "text-sm whitespace-nowrap transition-all duration-300 ease-in-out",
              collapsed
                ? "opacity-0 translate-x-[-8px] w-0 overflow-hidden"
                : "opacity-100 translate-x-0 w-auto ml-2"
            )}
          >
            {item.label}
          </span>
        </Link>

        {hasChildren && !collapsed && (
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(item.key);
            }}
            className="text-xs p-1 rounded hover:bg-transparent"
          >
            {isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && !collapsed && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="ml-6 mt-1 space-y-1 overflow-hidden"
          >
            {item.children!.map((child) => (
              <Link
                key={child.key}
                to={child.href || ""}
                className={clsx(
                  "flex items-center gap-2 px-2 py-2 rounded hover:bg-[#c5d4ec] text-sm",
                  child.href === pathname && "bg-[#ECF3FE] font-semibold"
                )}
              >
                {child.icon && (
                  <span className="text-xl font-medium w-6 flex justify-center">
                    {child.icon}
                  </span>
                )}
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {collapsed && hasChildren && hovered && menuPos
        ? createPortal(
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12 }}
              className="fixed z-[100000] bg-white shadow-lg rounded-md p-2 min-w-[160px]"
              style={{ top: menuPos.top, left: menuPos.left }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {item.children!.map((child) => (
                <Link
                  key={child.key}
                  to={child.href || ""}
                  onClick={() => setHovered(false)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded hover:bg-[#c5d4ec] text-sm",
                    child.href === pathname && "bg-[#ECF3FE] font-semibold"
                  )}
                >
                  {child.icon && (
                    <span className="text-xl w-6 flex justify-center">
                      {child.icon}
                    </span>
                  )}
                  <span>{child.label}</span>
                </Link>
              ))}
            </motion.div>,
            document.body
          )
        : null}
    </div>
  );
}
