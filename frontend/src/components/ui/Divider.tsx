import { cn } from "@/utils/common.utils";

interface DividerProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export default function Divider({
  className,
  orientation = "horizontal",
}: DividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        orientation === "horizontal"
          ? "my-4 h-px w-full bg-gray-200"
          : "mx-4 w-px self-stretch bg-gray-200",
        className
      )}
    />
  );
}
