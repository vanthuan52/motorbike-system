import * as React from "react";
import { cn } from "@/utils/common.utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, ref) => {
    return (
      <input
        ref={ref}
        type={props.type}
        data-slot="input"
        className={cn(
          // Base
          "flex h-11 w-full min-w-0 rounded-[var(--radius-md)] border bg-surface px-4 py-3 text-base text-text-primary shadow-[var(--shadow-inner)] outline-none",
          // M3 transition
          "[transition:color_var(--m3-transition-standard),border-color_var(--m3-transition-standard),box-shadow_var(--m3-transition-standard)]",
          // Placeholder
          "placeholder:text-text-muted",
          // Selection
          "selection:bg-primary-100 selection:text-primary-900",
          // Hover
          "hover:border-border-strong",
          // Focus
          "focus-visible:border-primary-500 focus-visible:shadow-[var(--shadow-focus-ring)] focus-visible:border-2",
          // File input
          "file:text-text-primary file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Error state
          "aria-invalid:border-error aria-invalid:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] aria-invalid:bg-error-bg",
          // Disabled
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-alt",
          // Responsive
          "md:text-sm",
          // Border default
          "border-border",
          props.className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
