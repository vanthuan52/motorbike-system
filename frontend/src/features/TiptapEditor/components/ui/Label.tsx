import React, { ReactNode } from "react";
import clsx from "clsx";

interface LabelProps {
  as?: keyof React.JSX.IntrinsicElements | React.ComponentType<any>;
  children: ReactNode;
  className?: string;
}

const Label = ({
  as: Comp = "label",
  children,
  className = "",
}: LabelProps) => {
  return <Comp className={clsx("rte-label", className)}>{children}</Comp>;
};

export default Label;
