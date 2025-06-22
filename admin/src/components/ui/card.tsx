import React from "react";
import { cn } from "@/utils/utils";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

const Card = (props: CardProps) => {
  const { children, className } = props;
  return (
    <div className={cn("bg-white p-5 rounded-xl shadow-card", className)}>
      {children}
    </div>
  );
};

export default Card;
