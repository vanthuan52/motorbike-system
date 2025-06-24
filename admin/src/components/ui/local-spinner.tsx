import React from "react";
import clsx from "clsx";

interface LocalSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
};

const colorMap = {
  primary: "border-t-primary border-gray-300",
  white: "border-t-white border-gray-100",
  gray: "border-t-gray-500 border-gray-300",
};

export const LocalSpinner: React.FC<LocalSpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  text,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-lg">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div
          className={clsx(
            "animate-spin rounded-full",
            sizeMap[size],
            colorMap[color],
            className
          )}
        />
        {text && <p className="text-sm text-gray-500">{text}</p>}
      </div>
    </div>
  );
};
