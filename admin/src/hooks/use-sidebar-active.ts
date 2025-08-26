import { SidebarMenuItem } from "@/components/sidebar/sidebar-menu";

export function useSidebarActive(item: SidebarMenuItem, pathname: string) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const isActive = !!item.href && item.href === pathname;

  const childActive = hasChildren
    ? item.children!.some((child) => {
        if (!child.href) return false;
        if (child.href === "/") {
          return pathname === "/";
        }
        return pathname.startsWith(child.href);
      })
    : false;

  const parentBgClass = isActive || childActive ? "bg-[#ECF3FE]" : "";

  return {
    isGroup: !item.href,
    hasChildren,
    isActive,
    childActive,
    parentBgClass,
  };
}
