"use client";

import { useCallback, useRef, useEffect, useState } from "react";

import { cn } from "@/utils/common.utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  className,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const clamp = (val: number) => Math.round(Math.min(max, Math.max(min, val)) / step) * step;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;
      return clamp(min + percent * (max - min));
    },
    [min, max, step]
  );

  const handlePointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(thumb);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const newVal = getValueFromPosition(e.clientX);
      if (dragging === "min") {
        onChange([Math.min(newVal, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newVal, value[0] + step)]);
      }
    },
    [dragging, getValueFromPosition, onChange, value, step]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const minPercent = getPercent(value[0]);
  const maxPercent = getPercent(value[1]);

  return (
    <div
      className={cn("relative w-full select-none", className)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1.5 w-full rounded-full bg-gray-200"
      >
        {/* Active range */}
        <div
          className="absolute h-full rounded-full bg-gray-900"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-gray-900 cursor-grab shadow-sm transition-shadow",
            dragging === "min" && "cursor-grabbing ring-4 ring-gray-900/10"
          )}
          style={{ left: `${minPercent}%` }}
          onPointerDown={handlePointerDown("min")}
          role="slider"
          aria-label="Minimum value"
          aria-valuemin={min}
          aria-valuemax={value[1]}
          aria-valuenow={value[0]}
          tabIndex={0}
        />

        {/* Max thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-gray-900 cursor-grab shadow-sm transition-shadow",
            dragging === "max" && "cursor-grabbing ring-4 ring-gray-900/10"
          )}
          style={{ left: `${maxPercent}%` }}
          onPointerDown={handlePointerDown("max")}
          role="slider"
          aria-label="Maximum value"
          aria-valuemin={value[0]}
          aria-valuemax={max}
          aria-valuenow={value[1]}
          tabIndex={0}
        />
      </div>
    </div>
  );
}
