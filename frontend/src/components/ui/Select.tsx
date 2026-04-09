"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/common.utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  className,
  width = "w-48",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", width, className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-2 bg-white rounded-lg px-3.5 py-2 text-sm transition-all duration-150",
          "border border-gray-200 shadow-sm",
          "hover:border-gray-300",
          open && "border-primary-500 ring-2 ring-primary-500/10"
        )}
      >
        <span className={selected ? "text-text-primary" : "text-text-muted"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in-0 slide-in-from-top-1 duration-150">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3.5 py-2 text-sm text-left transition-colors",
                opt.value === value
                  ? "text-primary-700 bg-primary-50 font-medium"
                  : "text-text-secondary hover:bg-gray-50 hover:text-text-primary"
              )}
            >
              <span className="flex-1">{opt.label}</span>
              {opt.value === value && (
                <Check className="w-3.5 h-3.5 text-primary-700 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
