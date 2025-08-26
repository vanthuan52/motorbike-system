import { useEffect, useRef, useState } from "react";

export function useSidebarHover<T extends HTMLElement>(
  collapsed: boolean,
  hasChildren: boolean
) {
  const triggerRef = useRef<T | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );

  const calculatePos = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return null;
    return { top: r.top, left: r.right };
  };

  const openHoverMenu = () => {
    if (!collapsed || !hasChildren) return;
    const p = calculatePos();
    if (p) setMenuPos(p);
    setHovered(true);
  };

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    openHoverMenu();
  };

  const handleMouseLeave = () => {
    if (!collapsed || !hasChildren) return;
    closeTimerRef.current = window.setTimeout(() => {
      setHovered(false);
      closeTimerRef.current = null;
    }, 150) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, []);

  return {
    triggerRef,
    hovered,
    menuPos,
    setHovered,
    handleMouseEnter,
    handleMouseLeave,
    openHoverMenu,
  };
}
