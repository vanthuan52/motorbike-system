import { Switch } from "antd";
import type { SwitchProps } from "antd";
import clsx from "clsx";

interface Props extends SwitchProps {
  className?: string;
}
export const GreenSwitch = ({ className = "", checked, ...props }: Props) => {
  return (
    <Switch
      {...props}
      checked={!!checked}
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
