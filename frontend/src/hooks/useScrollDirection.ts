"use client";

import { useState, useEffect, useRef } from "react";

type ScrollDirection = "up" | "down" | null;

/**
 * Tracks whether the user is scrolling up or down.
 * Returns the current scroll direction and whether we've scrolled
 * past a given threshold (default 50px).
 *
 * @param threshold - Minimum scroll distance before direction is set
 */
export function useScrollDirection(threshold = 50) {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const [pastThreshold, setPastThreshold] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;

      setPastThreshold(scrollY > threshold);

      if (Math.abs(scrollY - lastScrollY.current) < 10) {
        ticking.current = false;
        return;
      }

      setDirection(scrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, pastThreshold };
}
