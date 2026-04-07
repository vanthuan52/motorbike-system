import React from "react";
import { cn } from "@/utils/common.utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

/**
 * A Button component that supports different variants, sizes, and states.
 * Uses MotoService design tokens for consistent brand styling.
 */
const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...rest
}) => {
  const variantClasses: Record<string, string> = {
    primary:
      "bg-primary-500 text-white shadow-[var(--shadow-primary)] hover:bg-primary-600 hover:shadow-[var(--shadow-primary-hover)] hover:-translate-y-px active:bg-primary-700 active:shadow-[var(--shadow-primary-active)] active:translate-y-0 focus-visible:shadow-[var(--shadow-focus-ring)]",
    secondary:
      "bg-secondary-800 text-white shadow-[var(--shadow-md)] hover:bg-secondary-700 hover:shadow-[var(--shadow-md-hover)] hover:-translate-y-px active:bg-secondary-900 active:translate-y-0 focus-visible:shadow-[var(--shadow-focus-ring)]",
    danger:
      "bg-error text-white shadow-[var(--shadow-md)] hover:bg-red-700 hover:shadow-[var(--shadow-md-hover)] hover:-translate-y-px active:bg-red-800 active:translate-y-0 focus-visible:shadow-[var(--shadow-focus-ring)]",
    outline:
      "bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-50 hover:shadow-[var(--shadow-sm-hover)] hover:-translate-y-px active:bg-primary-100 active:text-primary-600 active:border-primary-600 active:translate-y-0 focus-visible:shadow-[var(--shadow-focus-ring)]",
  };

  const sizeClasses: Record<string, string> = {
    sm: "h-9 px-4 py-2 text-sm",
    md: "h-11 px-6 py-3 text-base",
    lg: "h-[52px] px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold cursor-pointer transition-all duration-200 ease-in-out outline-none",
        sizeClasses[size],
        variantClasses[variant],
        (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...rest}
    >
      {loading && (
        <span className="size-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
      )}
      {!loading && icon}
      {label}
    </button>
  );
};

export default Button;
