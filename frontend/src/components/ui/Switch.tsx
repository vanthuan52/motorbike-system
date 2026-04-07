import { Switch } from "antd";
import type { SwitchProps } from "antd";
import { cn } from "@/utils/common.utils";

interface Props extends SwitchProps {
  className?: string;
}

/**
 * A custom Switch component using brand primary color when checked.
 * Uses MotoService design tokens for consistent styling.
 */
export const BrandSwitch = ({ className = "", checked, ...props }: Props) => {
  return (
    <Switch
      {...props}
      checked={checked}
      className={cn(
        "!align-middle !border-none",
        checked
          ? "!bg-primary-500 hover:!bg-primary-600"
          : "!bg-secondary-300 hover:!bg-secondary-400",
        className
      )}
    />
  );
};

// Legacy alias for backward compatibility
export const GreenSwitch = BrandSwitch;
