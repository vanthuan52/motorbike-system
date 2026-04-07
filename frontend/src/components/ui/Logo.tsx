import { Link } from "@/lib/i18n";
import { ROUTER_PATH } from "@/constant/router-path";
import { cn } from "@/utils/common.utils";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href={ROUTER_PATH.HOME}
      onClick={onClick}
      className={cn("text-2xl font-extrabold text-primary-500 transition-opacity hover:opacity-90", className)}
    >
      Ant Motor
    </Link>
  );
}
