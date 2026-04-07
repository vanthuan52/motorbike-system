import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/common.utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold cursor-pointer transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none state-layer",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] active:shadow-[var(--shadow-primary-active)] focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        secondary:
          "bg-secondary-800 text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-md-hover)] active:shadow-[var(--shadow-md-active)] focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        destructive:
          "bg-error text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-md-hover)] active:shadow-[var(--shadow-md-active)] focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        tonal:
          "bg-primary-100 text-primary-800 hover:shadow-[var(--shadow-xs)] focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        outline:
          "bg-transparent text-primary-500 border border-border hover:bg-primary-50/50 active:bg-primary-100 focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        elevated:
          "bg-surface text-primary-500 elevation-1 hover:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        ghost:
          "bg-transparent text-secondary-900 hover:text-primary-500 active:text-primary-600 focus-visible:shadow-[var(--shadow-focus-ring)] [transition:all_var(--m3-transition-standard)]",
        link: "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600",
      },
      size: {
        default: "h-11 px-6 py-3 text-base rounded-[var(--radius-md)] has-[>svg]:px-4",
        sm: "h-9 px-4 py-2 text-sm rounded-[var(--radius-md)] gap-1.5 has-[>svg]:px-3",
        lg: "h-[52px] px-8 py-4 text-lg rounded-[var(--radius-md)] has-[>svg]:px-5",
        icon: "size-11 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
