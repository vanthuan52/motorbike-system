"use client";

import React from "react";
import { cn } from "@/utils/common.utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
  overlay?: boolean;
  text?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

const colorMap = {
  primary: "border-primary-200 border-t-primary-500",
  white: "border-white/30 border-t-white",
  gray: "border-secondary-200 border-t-secondary-500",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  overlay = false,
  text,
}) => {
  const spinner = (
    <div className="z-100 flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeMap[size],
          colorMap[color],
          className
        )}
      />
      {text && (
        <p className="text-sm text-text-secondary font-medium">{text}</p>
      )}
    </div>
  );

  if (!overlay) return spinner;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-secondary-900/40 backdrop-blur-sm">
      {spinner}
    </div>
  );
};
