import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90",
        outline:
          "bg-transparent border hover:bg-accent hover:text-accent-foreground",
        "outline-primary":
          "border-primary border bg-transparent text-primary hover:bg-primary/10",
        "outline-secondary":
          "border-secondary border bg-transparent text-secondary hover:bg-secondary/10",
        "outline-destructive":
          "border-destructive border bg-transparent text-destructive hover:bg-destructive/10",
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        "ghost-primary":
          "bg-transparent text-primary hover:bg-primary/10 hover:text-primary",
        "ghost-destructive":
          "bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive",
        link: "text-primary",
      },
      size: {
        sm: "h-8 px-2 text-xs [&_svg]:size-4",
        md: "h-9 px-3 text-sm [&_svg]:size-5",
        lg: "h-10 px-4 text-sm [&_svg]:size-6",
        xl: "h-12 px-5 text-base [&_svg]:size-6",
      },
      onlyIcon: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      {
        onlyIcon: true,
        size: "sm",
        className: "size-8",
      },
      {
        onlyIcon: true,
        size: "md",
        className: "size-9",
      },
      {
        onlyIcon: true,
        size: "lg",
        className: "size-11",
      },
      {
        onlyIcon: true,
        size: "xl",
        className: "size-12",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      onlyIcon: false,
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onlyIcon?: boolean;
  loading?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  onlyIcon = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      disabled={disabled || loading}
      data-state={loading ? "loading" : undefined}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, onlyIcon }), className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          {!onlyIcon && <span>Loading...</span>}
        </>
      ) : (
        children
      )}
    </Comp>
  );
};

export default Button;
