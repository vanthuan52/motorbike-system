import { Link } from "@/lib/i18n";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/common.utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  linkClassName?: string;
  activeClassName?: string;
  separatorClassName?: string;
  homeIconClassName?: string;
}

export default function Breadcrumbs({
  items,
  className = "",
  showHomeIcon = true,
  linkClassName,
  activeClassName,
  separatorClassName,
  homeIconClassName,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-text-secondary hover:text-primary-700 transition-colors duration-150",
                  idx === 0 && showHomeIcon && "gap-1.5",
                  linkClassName
                )}
              >
                {idx === 0 && showHomeIcon && (
                  <Home className={cn("w-3.5 h-3.5", homeIconClassName)} />
                )}
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium text-text-primary", activeClassName)}>
                {item.label}
              </span>
            )}
            {idx < items.length - 1 && (
              <ChevronRight className={cn("w-3.5 h-3.5 text-text-muted", separatorClassName)} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
