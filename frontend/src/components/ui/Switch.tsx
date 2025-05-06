import { Switch } from "antd";
import type { SwitchProps } from "antd";
import clsx from "clsx";

interface Props extends SwitchProps {
  className?: string;
}

/**
 * A custom Switch component with green color when checked.
 *
 * @param {string} [className] - Additional class names for the Switch component.
 * @param {boolean} checked - Whether the switch is checked or not.
 * @param {SwitchProps} [props] - Additional props for the Switch component.
 * @returns {JSX.Element} A Switch component with green color when checked.
 */
export const GreenSwitch = ({ className = "", checked, ...props }: Props) => {
  return (
    <Switch
      {...props}
      checked={checked}
      className={clsx(
        "!align-middle !border-none",
        checked
          ? "!bg-green-600 hover:!bg-green-700"
          : "!bg-gray-300 hover:!bg-gray-400",
        className
      )}
    />
  );
};
