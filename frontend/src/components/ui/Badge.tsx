import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/utils/common.utils";

const badgeVariants = cva(
  // Base: M3 design token mapping
  "inline-flex items-center gap-1 whitespace-nowrap font-medium select-none [transition:colors_var(--m3-transition-standard)]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-100 text-primary-800",
        secondary:
          "bg-secondary-100 text-secondary-800",
        outlined:
          "bg-transparent text-secondary-600 border border-border",
        success:
          "bg-success-bg text-[var(--color-success-text)] border border-[var(--color-success-border)]",
        warning:
          "bg-warning-bg text-[var(--color-warning-text)] border border-[var(--color-warning-border)]",
        error:
          "bg-error-bg text-[var(--color-error-text)] border border-[var(--color-error-border)]",
        info:
          "bg-info-bg text-[var(--color-info-text)] border border-[var(--color-info-border)]",
      },
      size: {
        xs: "text-[11px] px-1 py-px rounded-[var(--radius-sm)] min-h-5 tracking-wider",
        sm: "text-xs px-2 py-px rounded-[var(--radius-sm)] min-h-6 tracking-wider",
        md: "text-sm px-3 py-0.5 rounded-[var(--radius-sm)] min-h-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to render before the text */
  icon?: React.ReactNode;
  /** If true, renders a removable badge with an × button */
  removable?: boolean;
  /** Callback when remove button is clicked */
  onRemove?: () => void;
}

function Badge({
  className,
  variant,
  size,
  icon,
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 ml-0.5 rounded-full hover:bg-black/10 p-0.5 cursor-pointer transition-colors duration-150 focus:outline-none"
          aria-label="Remove"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

export { Badge, badgeVariants };
